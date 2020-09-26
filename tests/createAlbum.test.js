import { eventContext, } from './context';
import { main as createAlbum } from '../handlersAlbum/createAlbum';

const testGroupId = 'GsaQFBAI7XisyPzj';
const testAlbum = {
    name: 'My First Album',
    photoId: 'PdKw6cBAVQsT4Lts' // with a cover photo (from photo test)
    // photoFilename: 'duck.png' // with a cover photo (from photo test)
};

// ALBUM TEST ROUND 1 - AFTER GROUP
test.only('Create a new Album', async () => {
    const event = eventContext({
        pathParameters: { id: testGroupId },
        body: { ...testAlbum }
    });
    const response = await createAlbum(event);
    expect(response.statusCode).toEqual(200);
});