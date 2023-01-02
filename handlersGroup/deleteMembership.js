import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";
import { getMembersAndInvites } from "../libs/dynamodb-lib-memberships";
import { ses } from "blob-common/core/ses";
import { banBody } from "../emails/ban";
import { uninviteBody } from "../emails/uninvite";
import { leaveBody } from "../emails/leave";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const memberId = event.pathParameters.memberid;

    const data = (event.body) ? JSON.parse(event.body) : {};
    const version = data.version || 1;

    const groupMembers = await getMembersAndInvites(groupId);
    const userMembership = groupMembers.find(mem => (mem.PK.slice(2) === userId));
    if (!userMembership) throw new Error('not a member of this group');
    const user = userMembership.user;
    const deleteMembership = groupMembers.find(mem => (mem.PK.slice(2) === memberId));
    if (!deleteMembership) throw new Error('cannot find member to delete');
    if (deleteMembership.isFounder) throw new Error('cannot remove founder from group');
    const member = deleteMembership.user;
    const deleteIsInvite = (deleteMembership.status === 'invite');
    const inviteWasToEmail = deleteMembership.PK.includes('@');

    const userIsAdmin = (userMembership.role === 'admin');
    const userIsLastMember = (groupMembers.length === 1);
    const isLeavingGroup = (userId === memberId);
    const hasOtherAdmin = groupMembers.filter(mem => (mem.role === 'admin' && mem.PK.slice(2) !== userId)).length > 0;

    if (isLeavingGroup && !userIsLastMember && userIsAdmin && !hasOtherAdmin) {
        // this is call by user, so throw error: last user not allowed to leave manually.
        throw new Error('as last admin, cannot leave group');
    };
    if (!isLeavingGroup && !userIsAdmin) throw new Error('not authorized to delete other member');

    const deletePromise = dynamoDb.delete({
        Key: {
            PK: 'UM' + memberId,
            SK: groupId
        },
        ReturnValues: 'ALL_OLD'
    });

    // send mail to member
    const mailParams = {
        toName: member.name,
        toEmail: member.email,
        fromName: user.name,
        groupName: userMembership.group.name,
        inviteWasToEmail
    };
    console.log({ mailParams });
    const niceBody = (isLeavingGroup) ?
        leaveBody(mailParams)
        : (deleteIsInvite) ?
            uninviteBody(mailParams)
            : banBody(mailParams);
    const textBody = (isLeavingGroup) ?
        `Hi ${mailParams.toName}, je hebt "${mailParams.groupName}" op clubalmanac.com verlaten. Je foto's zijn uit alle albums daar verwijderd.`
        : (deleteIsInvite) ? `Hi ${mailParams.toName}, ${mailParams.fromName} heeft de uitnodiging om lid te worden van "${mailParams.groupName}"
op clubalmanac.com helaas ingetrokken.`
            : `Hi ${mailParams.toName}, ${mailParams.fromName} heeft je lidmaatschap van "${mailParams.groupName}" op clubalmanac.com helaas
beëindigd. Jouw (eventuele) foto's zijn uit alle albums verwijderd.`;
    const subject = (isLeavingGroup) ?
        `Je bent geen lid meer van "${mailParams.groupName}"`
        : (deleteIsInvite) ? `${mailParams.fromName} heeft de uitnodiging voor "${mailParams.groupName}" ingetrokken :(`
            : `${mailParams.fromName} heeft je uit "${mailParams.groupName}" gezet :(`;

    const mailPromise = ses.sendEmail({
        toEmail: mailParams.toEmail,
        fromEmail: 'clubalmanac <wouter@clubalmanac.com>',
        subject,
        data: niceBody,
        textData: textBody
    });
    const res = await Promise.all([
        deletePromise,
        mailPromise
    ]);
    return (version > 1) ?
        res[0].Attributes
        : 'ok';
});
