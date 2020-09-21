import { dynamoDb } from 'blob-common/core/db';

export const getUser = async (userId) => {
    const params = {
        TableName: process.env.photoTable,
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