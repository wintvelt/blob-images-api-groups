import { handler, getUserFromEvent } from "blob-common/core/handler";
import { cleanRecord } from "blob-common/core/dbClean";
import { now } from "blob-common/core/date";
import { getMember } from "../libs/dynamodb-lib-single";
import { listGroupAlbums } from "../libs/dynamodb-query-lib";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const membership = await getMember(userId, groupId);
    if (!membership || membership.status === 'invite') throw new Error('no access to group');

    const seenPics = membership.seenPics || [];
    const today = now();
    const albums = await listGroupAlbums(groupId, membership.role);
    const albumsWithNewPicsCount = albums.map(album => {
        const newPicsCount = seenPics.filter(pic => (
            pic.albumId === album.SK
            && (!pic.seenDate || pic.seenDate === today)
        )).length;
        const { photo, photoId, ...rest } = album;
        // const coverIsFlagged = !!photo?.flaggedDate;
        const coverIsFlagged = false;
        return (coverIsFlagged) ?
            { ...rest, newPicsCount }
            : { photo, photoId, ...rest, newPicsCount };
    });

    return albumsWithNewPicsCount.map(item => cleanRecord(item));
});