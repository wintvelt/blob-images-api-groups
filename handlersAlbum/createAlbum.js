import { handler, getUserFromEvent } from "blob-common/core/handler";
import { newAlbumId } from 'blob-common/core/ids';
import { sanitize } from 'blob-common/core/sanitize';
import { dbCreateItem } from 'blob-common/core/dbCreate';
import { cleanRecord } from 'blob-common/core/dbClean';
import { getMember, getPhotoById, getPhotoByUrl } from "../libs/dynamodb-lib-single";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const data = JSON.parse(event.body);
    const membership = await getMember(userId, groupId);
    if (!membership) throw new Error(`User membership of group ${groupId} not found`);
    if (!membership.role === 'admin') throw new Error('Not authorized to create album');

    let albumItem = {
        PK: 'GA' + groupId,
        SK: newAlbumId(),
        name: sanitize(data.name),
        group: membership.group,
    };

    if (data.photoId) {
        const photo = await getPhotoById(data.photoId, userId);
        // if (photo && !photo.flaggedDate) {
        if (photo) {
            albumItem.photoId = data.photoId;
            albumItem.photo = cleanRecord(photo);
        }
    } else if (data.photoFilename) {
        // const photoUrl = `protected/${event.requestContext.identity.cognitoIdentityId}/${data.photoFilename}`;
        const photoUrl = `protected/${userId.slice(1)}/${data.photoFilename}`;
        const photoFound = await getPhotoByUrl(photoUrl, userId);
        // if (photoFound && !photoFound.flaggedDate) {
        if (photoFound) {
            albumItem.photoId = photoFound.PK.slice(2);
            albumItem.photo = cleanRecord(photoFound);
        };
    }

    const result = await dbCreateItem(albumItem);

    return result;
});