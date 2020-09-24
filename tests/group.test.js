import { dynamoDb } from 'blob-common/core/db';
import { sleep } from 'blob-common/core/sleep';
import { eventContext, testGroupId, testUser, testPhotoId, setUp, cleanUp, testAlbumId } from './context';
import { main as createGroup } from '../handlersGroup/createGroup';
import { main as updateGroup } from '../handlersGroup/updateGroup';
import { main as sendInvite } from '../handlersGroup/sendInvite';
import { main as listGroups } from '../handlersGroup/listGroups';
import { main as listMembers } from '../handlersGroup/listMembers';
import { main as updateMembership } from '../handlersGroup/updateMembership';
import { getMember } from '../libs/dynamodb-lib-single';

const TIMEOUT = 4000;

const testGroup = {
    name: 'my test group',
    description: 'with a basic description'
};
const newGroupName = 'Better named group';

// GROUP TEST ROUND 1 - AFTER USER ROUND 1
// test.only('Create a new Group', async () => {
//     const event = eventContext({
//         body: { ...testGroup }
//     });
//     const response = await createGroup(event);
//     expect(response.statusCode).toEqual(200);
//     const group = JSON.parse(response.body);
//     expect(group.name).toEqual(testGroup.name);
// });

// GROUP TEST ROUND 2 (NEEDS GroupId from round 1 in context files)
// test('Invite a user to the group', async () => {
//     const event = eventContext({
//         pathParameters: { id: testGroupId },
//         body: {
//             toName: 'Michiel gast',
//             toEmail: 'wintvelt@me.com',
//             message: 'test message',
//             role: 'guest'
//         }
//     });
//     const response = await sendInvite(event);
//     expect(response.statusCode).toEqual(200);
// }, TIMEOUT * 4);

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