import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dbUpdateMulti } from "blob-common/core/db";
import { cleanRecord } from "blob-common/core/dbClean";
import { sanitize } from 'blob-common/core/sanitize';
import { getMemberRole, getPhotoById, getPhotoByUrl } from "../libs/dynamodb-lib-single";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const albumId = event.pathParameters.albumid;
    const data = JSON.parse(event.body);
    const { name, photoId, photoFilename } = data;

    const memberRole = await getMemberRole(userId, groupId);
    if (memberRole !== 'admin') throw new Error('album update not allowed');
    if (!name && !data.hasOwnProperty('photoId') && !photoFilename) throw new Error('relevant album update details missing');

    let albumUpdate = {};
    if (name) albumUpdate.name = sanitize(name);
    if (data.hasOwnProperty('photoId')) {
        if (photoId) {
            const photo = await getPhotoById(photoId, userId);
            if (photo) {
                albumUpdate.photoId = photoId;
                albumUpdate.photo = cleanRecord(photo);
            }
        } else {
            // clear photo from album
            albumUpdate.photoId = '';
            albumUpdate.photo = '';
        }
    } else if (photoFilename) {
        const photoUrl = `protected/${event.requestContext.identity.cognitoIdentityId}/${photoFilename}`;
        const photoFound = await getPhotoByUrl(photoUrl, userId);
        if (photoFound) {
            albumUpdate.photoId = photoFound.PK.slice(2);
            albumUpdate.photo = cleanRecord(photoFound);
        };
    }

    if (Object.keys(albumUpdate).length === 0) return 'ok';
    await dbUpdateMulti('GA' + groupId, albumId, albumUpdate);

    return { status: 'album updated' };
});