import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dbUpdateMulti } from "blob-common/core/db";
import { sanitize } from "blob-common/core/sanitize";
import { cleanRecord } from "blob-common/core/dbClean";
import { getMemberRole, getPhotoById } from "../libs/dynamodb-lib-single";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const data = JSON.parse(event.body);

    const memberRole = await getMemberRole(userId, groupId);
    if (memberRole !== 'admin') throw new Error('group update not allowed');

    let groupUpdate = {};
    if (data.name) groupUpdate.name = sanitize(data.name);
    if (data.description) groupUpdate.description = sanitize(data.description);
    if (data.photoId) {
        const photo = await getPhotoById(data.photoId, userId);
        if (photo) {
            groupUpdate.photoId = data.photoId;
            groupUpdate.photo = photo;
        }
    }

    if (Object.keys(groupUpdate).length === 0) return 'ok';
    const result = await dbUpdateMulti('GBbase', groupId, groupUpdate);

    return cleanRecord(result.Attributes);
});