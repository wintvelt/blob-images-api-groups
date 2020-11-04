import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";
import { getMember } from "../libs/dynamodb-lib-single";
import { cleanRecord } from "blob-common/core/dbClean";
import { getNewPics } from "../libs/lib-newPics";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const albumId = event.pathParameters.albumid;
    if (groupId === 'new') return '';

    const membership = await getMember(userId, groupId);
    if (membership.status === 'invite') throw new Error('not a member of this group');
    const userIsAdmin = (membership.role === 'admin');

    const params = {
        Key: {
            PK: 'GA' + groupId,
            SK: albumId,
        }
    };
    const result = await dynamoDb.get(params);
    const album = result.Item;
    if (!album) {
        throw new Error("Item not found.");
    }
    const newPics = getNewPics(albumId, membership.seenPics);
    return {
        ...cleanRecord(album),
        userIsAdmin,
        newPics,
        newPicsCount: newPics.length
    };
});
