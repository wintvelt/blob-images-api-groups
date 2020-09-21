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

    const newAlbum = {
        id: newAlbumId(),
        name: sanitize(data.name),
        image: data.image,
        imageUrl: data.image && data.image.image,
        group: membership.group,
    };
    const albumItem = {
        PK: 'GA' + groupId,
        SK: newAlbum.id,
        name: newAlbum.name,
        image: newAlbum.image,
        imageUrl: newAlbum.imageUrl,
        group: membership.group,
        compAfterDate: `${groupId}#${newAlbum.id}`,
    };

    const result = await dbCreateItem(albumItem);

    return result;
});