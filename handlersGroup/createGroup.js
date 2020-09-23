import { newGroupId } from 'blob-common/core/ids';
import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";
import { sanitize } from "blob-common/core/sanitize";
import { dbItem } from 'blob-common/core/dbCreate';
import { cleanRecord } from 'blob-common/core/dbClean';

import { getPhotoById } from "../libs/dynamodb-lib-single";
import { getUser } from "../libs/dynamodb-lib-user";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const data = JSON.parse(event.body);
    const user = await getUser(userId);
    const groupId = newGroupId();

    let newGroup = dbItem({
        PK: 'GBbase',
        SK: groupId,
        name: sanitize(data.name || ''),
        description: sanitize(data.description || ''),
    });
    if (data.photoId) {
        const photo = await getPhotoById(data.photoId, userId);

        if (photo) {
            newGroup.photoId = data.photoId;
            newGroup.photo = photo;
        }
    }

    const params = {
        TransactItems: [
            {
                Put: {
                    Item: newGroup
                }
            },
            {
                Put: {
                    Item: dbItem({
                        PK: 'UM' + userId,
                        SK: groupId,
                        role: 'admin',
                        user,
                        group: newGroup,
                    })
                }
            },
        ]
    };

    await dynamoDb.transact(params);

    return cleanRecord(params.TransactItems[0].Put.Item);
});