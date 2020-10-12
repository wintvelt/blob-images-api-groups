import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dbUpdateMulti, dynamoDb } from "blob-common/core/db";
import { cleanRecord } from "blob-common/core/dbClean";
import { sanitize } from 'blob-common/core/sanitize';
import { getMember, getPhotoById, getPhotoByUrl } from "../libs/dynamodb-lib-single";
import { now } from "blob-common/core/date";

const today = now();
const newPicsCount = (albumId, seenPics) => ((seenPics) ?
    seenPics.filter(item => (!item.seenDate || item.seenDate === today && item.albumId === albumId)).length
    : 0
);

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const albumId = event.pathParameters.albumid;
    const data = JSON.parse(event.body);
    const { name, photoId, photoFilename } = data;

    const membership = await getMember(userId, groupId);
    if (membership.role !== 'admin' || membership.status === 'invite') throw new Error('album update not allowed');

    if (!name && !data.hasOwnProperty('photoId') && !photoFilename) throw new Error('relevant album update details missing');

    const oldAlbumResult = await dynamoDb.get({ Key: { PK: 'GA' + groupId, SK: albumId } });
    const oldAlbum = oldAlbumResult.Attributes;
    if (!oldAlbum) throw new Error('album to update not found');

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

    const newAlbum = {
        ...cleanRecord(oldAlbum),
        newPicsCount: newPicsCount(albumId, membership.seenPics)
    };

    if (Object.keys(albumUpdate).length === 0) return newAlbum;
    const updateResult = await dbUpdateMulti('GA' + groupId, albumId, albumUpdate);

    return cleanRecord({
        ...newAlbum,
        ...updateResult.Attributes
    });
});