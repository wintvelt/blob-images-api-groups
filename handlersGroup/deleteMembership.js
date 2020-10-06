import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";
import { getMembers } from "../libs/dynamodb-lib-memberships";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const memberId = event.pathParameters.memberid;

    const groupMembers = await getMembers(groupId);
    const userMembership = groupMembers.find(mem => (mem.PK.slice(2) === userId));
    if (!userMembership) throw new Error('not a member of this group');

    const userIsAdmin = (userMembership.role === 'admin');
    const userIsLastMember = (groupMembers.length === 1);
    const isLeavingGroup = (userId === memberId);
    const hasOtherAdmin = groupMembers.filter(mem => (mem.role === 'admin' && mem.PK.slice(2) !== userId)).length > 0;

    if (isLeavingGroup && !userIsLastMember && userIsAdmin && !hasOtherAdmin) {
        // this is external call, so throw error.
        throw new Error('as last admin, cannot leave group');
    };
    if (!isLeavingGroup && !userIsAdmin) throw new Error('not authorized to delete other member');

    await dynamoDb.delete({
        Key: {
            PK: 'UM' + memberId,
            SK: groupId
        }
    });
    return 'ok';
});
