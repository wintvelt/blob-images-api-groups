import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";
import { getMembers } from "../libs/dynamodb-lib-memberships";
import { ses } from "blob-common/core/ses";
import { banBody } from "../emails/ban";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const memberId = event.pathParameters.memberid;

    const groupMembers = await getMembers(groupId);
    const userMembership = groupMembers.find(mem => (mem.PK.slice(2) === userId));
    if (!userMembership) throw new Error('not a member of this group');
    const user = userMembership.user;
    const deleteMembership = groupMembers.find(mem => (mem.PK.slice(2) === memberId));
    if (!deleteMembership) throw new Error('cannot find member to delete');
    const member = deleteMembership.user;

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
        }
    });

    // send mail to member
    const mailParams = {
        toName: member.name,
        toEmail: member.email,
        fromName: user.name,
        groupName: member.group.name,
    };
    console.log({ mailParams });
    const niceBody = (isLeavingGroup) ? leaveBody(mailParams) : banBody(mailParams);
    const textBody = (isLeavingGroup) ?
        `Hi ${mailParams.toName}, je hebt "${group.name}" op clubalmanac.com verlaten. Je foto's zijn uit alle albums daar verwijderd.`
        : `Hi ${mailParams.toName}, ${mailParams.fromName} je lidmaatschap van "${group.name}" op clubalmanac.com helaas
        beëindigd. Jouw (eventuele) foto's zijn uit alle albums verwijderd.`;
    const subject = (isLeavingGroup) ?
        `Je bent geen lid meer van "${group.name}"`
        : `${mailParams.fromName} heeft je uit "${group.name}" gezet :(`;

    const mailPromise = ses.sendEmail({
        toEmail: mailParams.toEmail,
        fromEmail: 'clubalmanac <wouter@clubalmanac.com>',
        subject,
        data: niceBody,
        textData: textBody
    });
    await Promise.all([
        deletePromise,
        mailPromise
    ])
    return 'ok';
});
