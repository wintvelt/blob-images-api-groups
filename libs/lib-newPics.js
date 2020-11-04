import { now } from "blob-common/core/date";

export const getNewPics = (albumId, seenPics = []) => {
    const today = now();
    return seenPics
        .filter(item => (!item.seenDate || item.seenDate === today) && item.albumId === albumId)
        .map(item => item.photoId);
};