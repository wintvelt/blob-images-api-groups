import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dbCreateItem } from "blob-common/core/dbCreate";
import { cleanRecord } from "blob-common/core/dbClean";
import { getMember, getPhotoByUser } from "../libs/dynamodb-lib-single";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const albumId = event.pathParameters.albumid;
    const data = JSON.parse(event.body);
    const { photoId } = data;

    const membership = await getMember(userId, groupId);
    if (!membership || membership.status === 'invite') throw new Error('not a member of this group');
    const userIsAdmin = (membership.role === 'admin');
    if (!userIsAdmin) throw new Error('not authorized to add photos');

    const photo = await getPhotoByUser(photoId, userId);
    if (!photo) throw new Error('photo not found');

    const foundPhotoId = photo.PK.slice(2);
    const Item = {
        PK: `GP${groupId}#${albumId}`,
        SK: foundPhotoId,
        photo: cleanRecord(photo),
        photoId
    };
    await dbCreateItem(Item);

    return { status: 'photo added to album' };
});
