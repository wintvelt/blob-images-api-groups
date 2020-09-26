import { handler, getUserFromEvent } from "blob-common/core/handler";
import { newAlbumId } from 'blob-common/core/ids';
import { sanitize } from 'blob-common/core/sanitize';
import { dbCreateItem } from 'blob-common/core/dbCreate';
import { getMember } from "../libs/dynamodb-lib-single";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const data = JSON.parse(event.body);
    const groupId = event.pathParameters.id;
    const membership = await getMember(userId, groupId);
    if (!membership.role === 'admin') throw new Error('Not authorized to create album');

    let albumItem = {
        PK: 'GA' + groupId,
        SK: newAlbumId(),
        name: sanitize(data.name),
        photoId: data.photoId,
        group: membership.group,
    };

    const result = await dbCreateItem(albumItem);

    return result;
});