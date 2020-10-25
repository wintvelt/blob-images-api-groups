import { handler, getUserFromEvent } from "blob-common/core/handler";
import { ses } from "blob-common/core/ses";
import { expireDate, now } from 'blob-common/core/date';
import { otob } from 'blob-common/core/base64';
import { sanitize } from 'blob-common/core/sanitize';
import { dbCreateItem } from "blob-common/core/dbCreate";
import { cleanRecord } from "blob-common/core/dbClean";

import { getUser, getUserByEmail } from "../libs/dynamodb-lib-user";
import { inviteBody } from "../emails/invite";
import { getMembersAndInvites } from "../libs/dynamodb-lib-memberships";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;

    const data = JSON.parse(event.body);
    const { toName, toEmail, message, role } = data;
    const safeToName = sanitize(toName);
    const safeMessage = sanitize(message);
    const safeToEmail = sanitize(toEmail.toLowerCase());

    const [members, invitedUserKeys] = await Promise.all([
        getMembersAndInvites(groupId),
        getUserByEmail(safeToEmail)
    ]);
    const member = members.find(mem => (mem.PK.slice(2) === userId && mem.status !== 'invite'));
    if (!member || member.role !== 'admin') throw new Error('not authorized to invite new');
    const { group, user } = member;

    if (members.length >= process.env.maxGroupMembers) throw new Error('max group size reached');

    const today = now();
    let invitedUser;
    if (invitedUserKeys) {
        const invitedAlreadyInGroup = members.find(mem => (mem.PK.slice(2) === invitedUserKeys.SK));
        if (invitedAlreadyInGroup) {
            if (invitedAlreadyInGroup.status !== 'invite') return { status: 'invitee is already member' };
            const hasActiveInvite = (expireDate(invitedAlreadyInGroup.createdAt) > today);
            if (hasActiveInvite) return { status: 'invitee already has active invite' };
        };
        const invitee = await getUser(invitedUserKeys.SK);
        if (!invitee) return { status: 'could find user to invite' };
        invitedUser = invitee;
    };

    const inviteeId = invitedUser ? invitedUser.SK : safeToEmail;
    const inviteKey = {
        PK: 'UM' + inviteeId,
        SK: groupId
    };
    const newMembershipPromise = dbCreateItem({
        PK: inviteKey.PK,
        SK: inviteKey.SK,
        role: role || 'guest',
        user: (invitedUser) ? cleanRecord(invitedUser) : {
            name: safeToName,
            email: safeToEmail
        },
        group,
        status: 'invite',
        invitation: {
            from: cleanRecord(user),
            message: safeMessage
        },
    });

    const frontEndUrl = process.env.frontend || process.env.devFrontend || 'http://localhost:3000';
    const inviteUrl = `${frontEndUrl}/invites/${otob(inviteKey)}`;
    const inviteParams = {
        toName,
        toEmail: safeToEmail,
        fromName: user.name,
        groupName: group.name,
        inviteUrl,
        message: safeMessage
    };
    const photoUrl = group.photo?.url;
    const expirationDate = expireDate(today);
    const niceBody = inviteBody({
        toName,
        fromName: user.name,
        groupName: group.name,
        photoUrl,
        inviteUrl,
        expirationDate,
        message: safeMessage
    });
    const textBody = `Hi ${toName},
    ${user.name} heeft je uitgenodigd voor "${group.name}" op clubalmanac.com
    Bezoek ${inviteUrl} om lid te worden!
    Deze uitnodiging is geldig tot ${expirationDate}.
    `;;
    console.log({ inviteParams });
    const inviteMailPromise = ses.sendEmail({
        toEmail: safeToEmail,
        fromEmail: 'clubalmanac <wouter@clubalmanac.com>',
        subject: `${user.name} nodigt je uit om lid te worden van "${group.name}"`,
        data: niceBody,
        textData: textBody
    });
    await Promise.all([newMembershipPromise, inviteMailPromise]);

    return { status: 'invite sent' };
});
