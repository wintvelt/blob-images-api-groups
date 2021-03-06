import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";
import { getMember } from "../libs/dynamodb-lib-single";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const albumId = event.pathParameters.albumid;
    const photoId = event.pathParameters.photoid;

    // check membership of group
    const membership = await getMember(userId, groupId);
    if (!membership) throw new Error('no access to group');

    // get photo
    const groupPhoto = await dynamoDb.get({
        Keys: { PK: `GP${groupId}#${albumId}`, SK: photoId }
    });

    // get seenPics from membership
    const userSeenPics = membership.seenPics || [];
    const isNew = !!userSeenPics.find(pic => (pic.photoId === photoId));

    const photoWithNew = {
        ...groupPhoto.photo,
        isNew
    };

    return photoWithNew;
});
