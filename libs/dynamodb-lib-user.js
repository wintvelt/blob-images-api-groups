import { dynamoDb } from 'blob-common/core/db';

export const getUser = async (userId) => {
    const params = {
        Key: {
            PK: 'USER',
            SK: userId,
        }
    };
    const result = await dynamoDb.get(params);
    const oldUser = result.Item;
    if (!oldUser) {
        throw new Error("User not found.");
    }
    return oldUser;
};

export const getUserByEmail = async (email) => {
    const params = {
        IndexName: process.env.emailIndex,
        KeyConditionExpression: '#pk = :pk and #email = :email',
        ExpressionAttributeNames: { '#pk': 'PK', '#email': 'email' },
        ExpressionAttributeValues: { ':pk': 'USER', ':email': email }
    };
    const result = await dynamoDb.query(params);
    if (!result.Items || result.Items.length === 0) return undefined;
    const userFound = result.Items[0];
    return userFound;
};