const imageBaseUrl = 'https://img.clubalmanac.com/';

const otoa = (object) => Buffer.from(JSON.stringify(object)).toString('base64');
export const makeEmailSrc = (key, width, height) => {
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