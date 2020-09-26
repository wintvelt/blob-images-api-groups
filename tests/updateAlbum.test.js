import { eventContext, } from './context';
import { main as updateAlbum } from '../handlersAlbum/updateAlbum';

const groupId = 'GsaQFBAI7XisyPzj'; // from testDb
const albumId = 'APfvplNY_jTIDCWX';
const albumUpdate = {
    photoFilename: 'duck.png'
};

test.only('Update an Album', async () => {
    const event = eventContext({
        pathParameters: { id: groupId, albumid: albumId },
        body: { ...albumUpdate }
    });
    const response = await updateAlbum(event);
    expect(response.statusCode).toEqual(200);
});