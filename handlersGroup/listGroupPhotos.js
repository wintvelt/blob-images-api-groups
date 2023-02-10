import { handler, getUserFromEvent } from "blob-common/core/handler";
import { getMemberRole } from "../libs/dynamodb-lib-single";
import { listGroupAlbums, listAlbumPhotosByDate } from "../libs/dynamodb-query-lib";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    console.log(groupId);
    const groupRole = await getMemberRole(userId, groupId);
    if (!groupRole) throw new Error('no access to this group');

    const groupAlbums = await listGroupAlbums(groupId, groupRole);
    const photoKeyList = await Promise.all(groupAlbums.map(async (album) => {
        const albumPhotos = await listAlbumPhotosByDate(groupId, album.SK);
        return {
            ...album,
            // data: albumPhotos.map(photo => photo.photo).filter(photo => !photo.flaggedDate)
            data: albumPhotos.map(photo => photo.photo)
        };
    }));
    return photoKeyList;
});
