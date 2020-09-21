import { handler, getUserFromEvent } from "blob-common/core/handler";
import { getMemberRole } from "../libs/dynamodb-lib-single";
import { listGroupAlbums, listAlbumPhotosByDate } from "../libs/dynamodb-query-lib";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const groupRole = await getMemberRole(userId, groupId);
    if (!groupRole) throw new Error('no access to this group');

    const groupAlbums = await listGroupAlbums(groupId, groupRole);
    const photoKeyList = await Promise.all(groupAlbums.map(album => {
        return listAlbumPhotosByDate(groupId, album.id);
    }));
    const photoKeysFlat = photoKeyList.reduce((acc, keyList) => (
        [...acc, ...keyList]
    ), []);
    return photoKeysFlat;
});
