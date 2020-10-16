import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";
import { getMemberRole } from "../libs/dynamodb-lib-single";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const albumId = event.pathParameters.albumid;

    const role = await getMemberRole(userId, groupId);
    if (role !== 'admin') throw new Error('not allowed to edit this group');

    await dynamoDb.delete({
        Key: {
            PK: `GA${groupId}`,
            SK: albumId
        }
    });

    return { status: 'group deleted successfully' };
});
