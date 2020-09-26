import { eventContext,  } from './context';
import { main as createGroup } from '../handlersGroup/createGroup';

const testGroup = {
    name: 'The Great Group',
    description: 'with a helpful description',
    photoId: 'PdKw6cBAVQsT4Lts' // with a cover photo (from photo test)
    // photoFilename: 'duck.png' // with a cover photo (from photo test)
};

// GROUP TEST ROUND 1 - AFTER USER ROUND 1
test.only('Create a new Group', async () => {
    const event = eventContext({
        body: { ...testGroup }
    });
    const response = await createGroup(event);
    expect(response.statusCode).toEqual(200);
    const group = JSON.parse(response.body);
    expect(group.name).toEqual(testGroup.name);
});