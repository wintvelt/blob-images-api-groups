import { eventContext, } from './context';
import { main as deleteMembership } from '../handlersGroup/deleteMembership';

const testGroupId = 'GsaQFBAI7XisyPzj'; // from testDB, needs at least 2 members
const testUserId = 'U123normal-test-id123'; // should be admin
const testUserId2 = 'U123test-user2'; // should be guest

test('Remove a member from a group', async () => {
    const event = eventContext({
        userId: testUserId,
        pathParameters: { 
            id: testGroupId,
            memberid: testUserId,
        },
    });
    const response = await deleteMembership(event);
    console.log(response);
    expect(response.statusCode).toEqual(200);
}, 8000);