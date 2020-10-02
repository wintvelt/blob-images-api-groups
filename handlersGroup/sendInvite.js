import { handler, getUserFromEvent } from "blob-common/core/handler";
import { ses } from "blob-common/core/ses";
import { expireDate, now } from 'blob-common/core/date';
import { otob } from 'blob-common/core/base64';
import { sanitize } from 'blob-common/core/sanitize';
import { dbCreateItem } from "blob-common/core/dbCreate";
import { cleanRecord } from "blob-common/core/dbClean";

import { getMember } from "../libs/dynamodb-lib-single";
import { getUser, getUserByEmail } from "../libs/dynamodb-lib-user";
import { invite } from "../emails/invite";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;

    const data = JSON.parse(event.body);
    const { toName, toEmail, message, role } = data;
    const safeToName = sanitize(toName);
    const safeMessage = sanitize(message);
    const safeToEmail = sanitize(toEmail.toLowerCase());

    const [member, invitedUserKeys] = await Promise.all([
        getMember(userId, groupId),
        getUserByEmail(safeToEmail)
    ]);
    if (!member || member.role !== 'admin') throw new Error('not authorized to invite new');
    const { group, user } = member;
    const today = now();

    let invitedUser;
    if (invitedUserKeys) {
        const [invitedAlreadyInGroup, invitee] = await Promise.all([
            getMember(invitedUserKeys.SK, groupId),
            getUser(invitedUserKeys.SK)
        ]);
        if (invitedAlreadyInGroup) {
            if (invitedAlreadyInGroup.status !== 'invite') return { status: 'invitee is already member' };
            const hasActiveInvite = (expireDate(invitedAlreadyInGroup.createdAt) > today);
            if (hasActiveInvite) return { status: 'invitee already has active invite' };
        };
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
    const url = `${frontEndUrl}/invites/${otob(inviteKey)}`;
    const inviteParams = {
        toName,
        toEmail: safeToEmail,
        fromName: user.name,
        groupName: group.name,
        url,
        expirationDate: expireDate(today),
        message: safeMessage
    };
    console.log({ inviteParams });
    const inviteMailPromise = ses.send(invite(inviteParams));
    await Promise.all([newMembershipPromise, inviteMailPromise])

    return { status: 'invite sent' };
});
