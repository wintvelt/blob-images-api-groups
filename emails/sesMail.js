export const sesMail = ({toEmail, fromEmail, subject, data, textData}) => ({
    Destination: {
        ToAddresses: [
            toEmail,
        ]
    },
    Message: {
        Body: {
            Html: {
                Charset: "UTF-8",
                Data: data
            },
            Text: {
                Charset: "UTF-8",
                Data: textData
            }
        },
        Subject: {
            Charset: "UTF-8",
            Data: subject
        }
    },
    ReplyToAddresses: [
        fromEmail,
    ],
    Source: fromEmail,
});