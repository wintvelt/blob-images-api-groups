import { handler, getUserFromEvent } from "blob-common/core/handler";
import { getMember } from "../libs/dynamodb-lib-single";
import { listAlbumPhotosByDate } from "../libs/dynamodb-query-lib";
import { getNewPics } from "../libs/lib-newPics";

const photoSort = (a, b) => (
    (a.isNew && !b.isNew) ?
        -1
        : (!a.isNew && b.isNew) ?
            1
            : (a.createdAt > b.createdAt) ?
                -1
                : (a.createdAt < b.createdAt) ? 1
                    : 0
);

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const albumId = event.pathParameters.albumid;

    const member = await getMember(userId, groupId);
    if (!member || member.status === 'invite') throw new Error('not a member of this group');
    const newPics = getNewPics(albumId, member.seenPics);

    const albumPhotos = await listAlbumPhotosByDate(groupId, albumId);
    const albumPhotoKeys = albumPhotos
        // .filter(photo => (!photo.photo.flaggedDate))
        .map(photo => ({
            PK: photo.PK,
            SK: photo.SK,
            isNew: newPics.includes(photo.SK),
            createdAt: photo.dateSK.slice(0, 10)
        }));
    const sortedPhotoKeys = [...albumPhotoKeys].sort(photoSort);
    return sortedPhotoKeys;
});