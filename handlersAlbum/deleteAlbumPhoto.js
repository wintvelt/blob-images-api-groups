import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";
import { getMemberRole, getPhotoByUser } from "../libs/dynamodb-lib-single";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const albumId = event.pathParameters.albumid;
    const photoId = event.pathParameters.photoid;

    const memberRole = await getMemberRole(userId, groupId);
    if (!memberRole) throw new Error('not a member of this group');
    const userIsAdmin = (memberRole === 'admin');
    const ownerPhoto = await getPhotoByUser(photoId, userId);
    const userIsOwner = !!ownerPhoto;

    if (!userIsAdmin && !userIsOwner) throw new Error('not authorized to remove photo from album');

    const result = await dynamoDb.delete({
        Key: {
            PK: `GP${groupId}#${albumId}`,
            SK: photoId,
        },
        ReturnValues: 'ALL_OLD'
    });
    console.log(result);
    if (!result.Attributes) throw new Error('could not remove photo from album');

    return { status: 'photo removed from album' };
});
