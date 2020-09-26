import { eventContext, } from './context';
import { main as updateGroup } from '../handlersGroup/updateGroup';

const groupId = 'GsaQFBAI7XisyPzj'; // from testDb
const groupUpdate = {
    photoId: ''
};

test.only('Update a  Group', async () => {
    const event = eventContext({
        pathParameters: { id: groupId },
        body: { ...groupUpdate }
    });
    const response = await updateGroup(event);
    expect(response.statusCode).toEqual(200);
});