import { handler, getUserFromEvent } from "blob-common/core/handler";
import { now } from "blob-common/core/date";
import { getMembershipsAndInvites } from "../libs/dynamodb-lib-memberships";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const today = now();
    const items = await getMembershipsAndInvites(userId);
    const groups = items.map(item => ({
        ...item.group,
        userRole: item.role,
        newPicsCount: (item.seenPics) ?
            item.seenPics.filter(item => (!item.seenDate || item.seenDate === today)).length
            : 0,
        createdAt: item.createdAt,
    }));

    return groups;
});