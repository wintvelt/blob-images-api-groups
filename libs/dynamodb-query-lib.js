import { dynamoDb } from 'blob-common/core/db';

export const listPhotosByDate = async (userId) => {
    const params = {
        IndexName: process.env.dateIndex,
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames: {
            '#pk': 'PK',
        },
        ExpressionAttributeValues: {
            ":PK": 'PO' + userId,
        },
    };

    const result = await dynamoDb.query(params);
    const items = result.Items;
    return items || [];
};

export const listGroupAlbums = async (groupId, groupRole) => {
    const params = {
        KeyConditionExpression: "#g = :g",
        ExpressionAttributeNames: {
            '#g': 'PK',
        },
        ExpressionAttributeValues: {
            ":g": 'GA' + groupId,
        },
    };

    const result = await dynamoDb.query(params);
    const items = result.Items;
    if (!items) {
        throw new Error("albums retrieval failed.");
    };
    const albums = items.map(item => ({
        ...item,
        userIsAdmin: (groupRole === 'admin'),
    }));
    return [...albums].sort((a, b) => (a.createdAt < b.createdAt) ? 1 : (a.createdAt > b.createdAt) ? -1 : 0);
};

export const listAlbumPhotosByDate = async (groupId, albumId) => {
    const params = {
        IndexName: process.env.dateIndex,
        KeyConditionExpression: "#dPK = :dPK",
        ExpressionAttributeNames: {
            '#dPK': 'datePK',
        },
        ExpressionAttributeValues: {
            ":dPK": `GP${groupId}#${albumId}`,
        },
    };

    const result = await dynamoDb.query(params);
    const items = result.Items;
    if (!items) {
        throw new Error("album photos retrieval failed.");
    };
    return items;
};

export const listAlbumPhotos = async (groupId, albumId) => {
    const params = {
        KeyConditionExpression: "#a = :groupAlbum",
        ExpressionAttributeNames: {
            '#a': 'PK',
        },
        ExpressionAttributeValues: {
            ":groupAlbum": `GP${groupId}#${albumId}`,
        },
    };

    const result = await dynamoDb.query(params);
    const items = result.Items;
    if (!items) {
        throw new Error("album photos retrieval failed.");
    };
    const albumPhotos = items.map(item => ({
        ...item.photo,
        image: item.photo.url,
        id: item.photo.PK.slice(2),
        date: item.photo.createdAt,
    }));
    return albumPhotos;
};

export const listPhotoRatings = async (photoId) => {
    const params = {
        KeyConditionExpression: "#pk = :pid",
        ExpressionAttributeNames: {
            '#pk': 'PK',
        },
        ExpressionAttributeValues: {
            ":pid": 'UF' + photoId,
        },
    };

    const result = await dynamoDb.query(params);
    const items = result.Items || [];
    return items;
};