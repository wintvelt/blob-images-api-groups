import { part1, part2, part3, part4, part5, part6, part7 } from './emailBlocks';

const imageBaseUrl = 'https://img.clubalmanac.com/';

const otoa = (object) => Buffer.from(JSON.stringify(object)).toString('base64');
const makeImageUrl = (key, width, height) => {
    if (!key) return '';
    let body = {
        "bucket": process.env.bucket || process.env.devBucket || 'blob-images-dev',
        "key": key
    };
    if (width || height) {
        let resize = { "fit": "cover" };
        if (width) resize.width = width;
        if (height) resize.height = height;
        body.edits = { resize };
    }
    return imageBaseUrl + otoa(body);
};

const dividerSrc = makeImageUrl('public/img/invite_divider.png');

export const inviteMail = ({ toName, fromName, groupName, photoUrl, inviteUrl, expirationDate, message }) => (
    part1 +
    part2(makeImageUrl('public/img/logo_email_1.png')) +
    part3(inviteUrl, (photoUrl) ? makeImageUrl(photoUrl, 640, 200) : makeImageUrl('public/img/invite.png')) +
    part4(toName, fromName, groupName, message, dividerSrc) +
    part5(inviteUrl) +
    part6(expirationDate) +
    part7(makeImageUrl('public/img/signature_wouter.png'), inviteUrl)
);