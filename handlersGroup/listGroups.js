import { handler, getUserFromEvent } from "blob-common/core/handler";
import { now } from "blob-common/core/date";
import { getMemberships } from "../libs/dynamodb-lib-memberships";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const today = now();
    const items = await getMemberships(userId);
    const groups = items.map(item => {
        const { photo, photoId, ...rest } = item.group;
        // const cleanGroup = (photo?.flaggedDate) ? rest : { photo, photoId, ...rest };
        const cleanGroup = { photo, photoId, ...rest };
        return {
            ...cleanGroup,
            sortDate: item.group?.sortDate || item.group?.createdAt || item.createdAt,
            userRole: item.role,
            status: item.status,
            isFounder: item.isFounder,
            newPicsCount: (item.seenPics) ?
                item.seenPics.filter(item => (!item.seenDate || item.seenDate === today)).length
                : 0,
            createdAt: item.group?.createdAt || item.createdAt,
        };
    });

    return [...groups].sort((a, b) => (a.sortDate < b.sortDate) ? 1 : (a.sortDate > b.sortDate) ? -1 : 0);
});