import { inviteMail } from "./emailTemplate";
import { sesMail } from "./sesMail";

export const invite = ({ toName, toEmail, fromName, groupName, photoUrl, inviteUrl, expirationDate, message }) => {
    const niceMail = inviteMail({
        toName, fromName, groupName, photoUrl, inviteUrl, expirationDate, message
    });
    const textMail = `Hi ${toName},
    ${fromName} heeft je uitgenodigd om voor "${groupName}" op clubalmanac.com
    Bezoek ${inviteUrl} om lid te worden!
    Deze uitnodiging is geldig tot ${expirationDate}.
    `;
    const subject = `${fromName} nodigt je uit om lid te worden van "${groupName}"`;
    return sesMail({
        toEmail,
        fromEmail: 'wouter@clubalmanac.com',
        subject,
        data: niceMail,
        textData: textMail
    });
};