import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dbUpdate, dbUpdateMulti } from "blob-common/core/db";
import { getMember } from "../libs/dynamodb-lib-single";
import { ses } from "blob-common/core/ses";
import { memberUpdateBody, memberUpdateText, memberUpdateSubject } from "../emails/memberUpdate";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const memberId = event.pathParameters.memberid;
    if (userId === memberId) throw new Error('not authorized to update your own membership');
    if (!event.body) throw new Error('bad request - update missing');
    const data = JSON.parse(event.body);
    const { newRole, makeFounder } = data;

    const userMember = await getMember(userId, groupId);
    if (!userMember || !userMember.role === 'admin') throw new Error('not authorized to update membership');
    if (newRole && !['admin', 'guest'].includes(newRole)) throw new Error('invalid new role');
    if (makeFounder && !userMember.isFounder) throw new Error('not allowed to transfer foundership');

    const memberToUpdate = await getMember(memberId, groupId);
    if (!memberToUpdate) throw new Error('member not found in this group');

    let promises = [];

    if (makeFounder) {
        promises.push(dbUpdateMulti('UM' + memberId, groupId, {
            role: 'admin',
            isFounder: true
        }));
        promises.push(dbUpdateMulti('UM' + userId, groupId, {
            isFounder: false
        }));
    } else {
        promises.push(dbUpdate('UM' + memberId, groupId, 'role', newRole));
    }

    // send mail to member
    const member = memberToUpdate.user;
    const user = userMember.user;

    const mailParams = {
        toName: member.name,
        toEmail: member.email,
        fromName: user.name,
        groupName: memberToUpdate.group.name,
        groupId: memberToUpdate.SK,
        photoUrl: memberToUpdate.group.photo?.url,
        newRole,
        makeFounder
    };
    console.log({ mailParams });
    const niceBody = memberUpdateBody(mailParams);
    const textBody = memberUpdateText(mailParams);
    const subject = memberUpdateSubject(mailParams);

    const mailPromise = ses.sendEmail({
        toEmail: mailParams.toEmail,
        fromEmail: 'clubalmanac <wouter@clubalmanac.com>',
        subject,
        data: niceBody,
        textData: textBody
    });
    promises.push(mailPromise);

    await Promise.all(promises);
    return 'ok';
});
