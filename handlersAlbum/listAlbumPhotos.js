import { handler, getUserFromEvent } from "blob-common/core/handler";
import { getMemberRole } from "../libs/dynamodb-lib-single";
import { listAlbumPhotosByDate } from "../libs/dynamodb-query-lib";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const albumId = event.pathParameters.albumid;

    const memberRole = await getMemberRole(userId, groupId);
    if (!memberRole) throw new Error('not a member of this group');

    const albumPhotoKeys = await listAlbumPhotosByDate(groupId, albumId);
    return albumPhotoKeys;
});