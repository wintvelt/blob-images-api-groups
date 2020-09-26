import { eventContext, testGroupId,testUserId } from './context';
import { main as createAlbum } from '../handlersAlbum/createAlbum';

const TIMEOUT = 4000;

// ALBUM TEST ROUND 1
test('create album in group', async () => {
    const event = eventContext({
        pathParameters: { id: testGroupId },
    });
    const response = await sendInvite(event);
    expect(response.statusCode).toEqual(200);

    const event2 = eventContext({
        pathParameters: { id: testGroupId },
        body: {
            toName: 'Bas email',
            toEmail: 'wouter.intvelt@gmail.com',
            message: 'test message',
            role: 'admin'
        }
    });
    const response2 = await sendInvite(event);
    expect(response2.statusCode).toEqual(200);
}, TIMEOUT * 4);

test('Change group name', async () => {
    const event = eventContext({
        pathParameters: { id: testGroupId },
        body: { name: newGroupName }
    });
    const response = await updateGroup(event);
    expect(response.statusCode).toEqual(200);
    const group = JSON.parse(response.body);
    expect(group.name).toEqual(newGroupName);
});

// test('List user groups (memberships)', async () => {
//     const event = eventContext();
//     const response = await listGroups(event);
//     expect(response.statusCode).toEqual(200);
//     const memberships = JSON.parse(response.body);
//     expect(memberships[0].userRole).toBe('admin');
// });

// test('List all members of a group', async () => {
//     const event = eventContext({
//         pathParameters: { id: testGroupId },
//     });
//     const response = await listMembers(event);
//     expect(response.statusCode).toEqual(200);
//     const members = JSON.parse(response.body);
//     expect(members.length).toEqual(2);
//     expect(members[0]).toHaveProperty('role');
// });

// test('Update role of a member', async () => {
//     const event = eventContext({
//         pathParameters: { id: testGroupId, memberid: testUser2Id },
//         body: { newRole: 'admin' },
//     });
//     const response = await updateMembership(event);
//     expect(response.statusCode).toEqual(200);

//     const changedMember = await getMember(testUser2Id, testGroupId);
//     console.log(changedMember);
// });