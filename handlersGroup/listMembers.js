import { handler, getUserFromEvent } from "blob-common/core/handler";
import { getMember } from "../libs/dynamodb-lib-single";
import { getMembersAndInvites } from "../libs/dynamodb-lib-memberships";

const compareMembers = (a, b) => {
    if (a.status && a.status === 'invite') {
        if (b.status && b.status === 'invite') {
            if (a.user.name.toLowerCase() > b.user.name.toLowerCase()) return 1;
            if (a.user.name.toLowerCase() < b.user.name.toLowerCase()) return -1;
            return 0;
        } else return 1;
    } else {
        if (b.status && b.status === 'invite') {
            return -1;
        } else {
            if (a.user.name.toLowerCase() > b.user.name.toLowerCase()) return 1;
            if (a.user.name.toLowerCase() < b.user.name.toLowerCase()) return -1;
            return 0;
        }
    }
};

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groupId = event.pathParameters.id;
    const membership = await getMember(userId, groupId);
    const groupRole = membership && (membership.status !== 'invite') && membership.role;
    if (!groupRole) throw new Error('no access to group');
    const isAdmin = (groupRole === 'admin');
    const isFounder = membership.isFounder;

    const members = await getMembersAndInvites(groupId);
    const hasOtherAdmin = members.find(mem => (mem.user.SK !== userId && mem.role === 'admin' && mem.status !== 'invite'));

    return members.sort(compareMembers).map(item => ({
        ...item.user,
        PK: item.PK,
        SK: item.SK,
        userRole: item.role,
        isFounder: item.isFounder,
        isCurrent: (item.user.SK === userId),
        status: item.status,
        options: (item.user.SK === userId) ?
            // options for user themselves
            (!isFounder && hasOtherAdmin) ? ['leave'] : []
            // options for other members
            : (isFounder && isAdmin && item.status !== 'invite') ?
                // make other non-invite members founder (only founder can do)
                [
                    (item.role === 'admin') ? 'guestify' : 'adminify',
                    'founderify',
                    'ban'
                ]
                : (isAdmin && !item.isFounder) ?
                    // for non-founding admins on other members + invites
                    [
                        (item.role === 'admin') ? 'guestify' : 'adminify',
                        (item.status === 'invite') ? 'uninvite' : 'ban'
                    ]
                    // non-admins get no options
                    : [],
        createdAt: item.createdAt
    }));
});