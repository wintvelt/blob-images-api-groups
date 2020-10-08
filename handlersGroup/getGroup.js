import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";

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

    return { ...membership.group, userRole, isFounder };
});
