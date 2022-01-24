import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dbUpdateMulti } from "blob-common/core/db";
import { sanitize } from "blob-common/core/sanitize";
import { cleanRecord } from "blob-common/core/dbClean";
import { getMember, getPhotoById, getPhotoByUrl } from "../libs/dynamodb-lib-single";
import { now } from "blob-common/core/date";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const data = JSON.parse(event.body);

    const membership = await getMember(userId, groupId);
    if (membership.role !== 'admin' || membership.status === 'invite') throw new Error('group update not allowed');

    let groupUpdate = {};
    if (data.name) groupUpdate.name = sanitize(data.name);
    if (data.description) groupUpdate.description = sanitize(data.description);
    if (data.hasOwnProperty('photoId')) {
        if (data.photoId) {
            const photo = await getPhotoById(data.photoId, userId);
            if (photo) {
                groupUpdate.photoId = data.photoId;
                groupUpdate.photo = cleanRecord(photo);
            }
        } else {
            // clear photo from group
            groupUpdate.photoId = '';
            groupUpdate.photo = '';
        }
    } else if (data.photoFilename) {
        // const photoUrl = `protected/${event.requestContext.identity.cognitoIdentityId}/${data.photoFilename}`;
        const photoUrl = `protected/${userId.slice(1)}/${data.photoFilename}`;
        const photoFound = await getPhotoByUrl(photoUrl, userId);
        if (photoFound) {
            groupUpdate.photoId = photoFound.PK.slice(2);
            groupUpdate.photo = cleanRecord(photoFound);
        };
    }

    const userRole = membership.role;
    const isFounder = membership.isFounder;
    const today = now();
    const newPicsCount = (membership.seenPics) ?
        membership.seenPics.filter(item => (!item.seenDate || item.seenDate === today)).length
        : 0;

    const newGroup = {
        ...membership.group,
        userRole,
        isFounder,
        newPicsCount,
        createdAt: membership.createdAt
    };

    if (Object.keys(groupUpdate).length === 0) return newGroup;

    const result = await dbUpdateMulti('GBbase', groupId, groupUpdate);

    return cleanRecord({
        ...newGroup,
        ...result.Attributes
    });
});