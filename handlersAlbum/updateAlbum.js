import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dbUpdateMulti } from "blob-common/core/db";
import { cleanRecord } from "blob-common/core/dbClean";
import { sanitize } from 'blob-common/core/sanitize';
import { getMemberRole, getPhotoById } from "../libs/dynamodb-lib-single";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const albumId = event.pathParameters.albumid;
    const data = JSON.parse(event.body);
    const { name, photoId } = data;

    const memberRole = await getMemberRole(userId, groupId);
    if (memberRole !== 'admin') throw new Error('album update not allowed');
    if (!name && !photoId) throw new Error('relevant album update details missing');

    let albumUpdate = {};
    if (name) albumUpdate.name = sanitize(name);
    if (photoId) {
        albumUpdate.photoId = photoId;
        const photo = await getPhotoById(photoId, userId);
        if (!photo) throw new Error('photo with provided id not found');
        albumUpdate.photo = cleanRecord(photo);
    }

    await dbUpdateMulti('GA' + groupId, albumId, albumUpdate);

    return { status: 'album updated' };
});