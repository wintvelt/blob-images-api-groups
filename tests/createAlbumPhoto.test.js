import { eventContext, } from './context';
import { main as createAlbumPhoto } from '../handlersAlbum/createAlbumPhoto';

const groupId = 'GsaQFBAI7XisyPzj'; // from testDb
const albumId = 'APfvplNY_jTIDCWX';
const photoId = 'PdKw6cBAVQsT4Lts';

test.only('Add photo to an album', async () => {
    const event = eventContext({
        pathParameters: { id: groupId, albumid: albumId },
        body: { photoId }
    });
    const response = await createAlbumPhoto(event);
    expect(response.statusCode).toEqual(200);
});