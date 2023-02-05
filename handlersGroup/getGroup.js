import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";
import { now } from "blob-common/core/date";
import { getMembersAndInvites } from "../libs/dynamodb-lib-memberships";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    if (groupId === 'new') return '';

    const result = await dynamoDb.get({
        Key: {
            PK: 'UM' + userId,
            SK: groupId
        }
    });
    const membership = result.Item;
    if (!membership || membership.status === 'invite') throw new Error('not a member of this group');
    const userRole = membership.role;
    const isFounder = membership.isFounder;
    const today = now();
    const newPicsCount = (membership.seenPics) ?
        membership.seenPics.filter(item => (!item.seenDate || item.seenDate === today)).length
        : 0;

    // get no of members and invites too
    const members = await getMembersAndInvites(groupId);
    const memberCount = members.length;
    const maxMembers = parseInt(process.env.maxGroupMembers);
    const mayInvite = (memberCount < maxMembers);

    return {
        ...membership.group,
        sortDate: membership.group.sortDate || membership.group.createdAt,
        userRole,
        isFounder,
        newPicsCount,
        memberCount,
        maxMembers,
        mayInvite
    };
});
