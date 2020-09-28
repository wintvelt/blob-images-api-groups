import { eventContext, testGroupId } from './context';
import { main as sendInvite } from '../handlersGroup/sendInvite';

const TIMEOUT = 4000;

// GROUP TEST ROUND 2 (NEEDS GroupId from round 1 in context files)
test.only('Invite user and email to the group', async () => {
    const event = eventContext({
        pathParameters: { id: testGroupId },
        body: {
            toName: 'Michiel gast',
            toEmail: 'wintvelt@me.com',
            message: 'test message',
            role: 'guest'
        }
    });
    const response = await sendInvite(event);
    expect(response.statusCode).toEqual(200);

    // const event2 = eventContext({
    //     pathParameters: { id: testGroupId },
    //     body: {
    //         toName: 'Bas email',
    //         toEmail: 'wouter.intvelt@gmail.com',
    //         message: 'test message',
    //         role: 'admin'
    //     }
    // });
    // const response2 = await sendInvite(event2);
    // expect(response2.statusCode).toEqual(200);
}, TIMEOUT * 4);