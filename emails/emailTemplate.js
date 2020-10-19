import {
    buttonCell, buttonEscape, dividerCell, emailBody, row, textCell,
    footerRow, greeting, headerRow, paragraph, photoRow, signatureCell
} from './emailBlocks';
import { makeEmailSrc } from './emailHelpers';

const dividerSrc = makeEmailSrc('public/img/invite_divider.png');

export const inviteMail = ({ toName, fromName, groupName, photoUrl, inviteUrl, expirationDate, message }) => (
    emailBody([
        headerRow(makeEmailSrc('public/img/logo_email_1.png')),
        photoRow((photoUrl) ? makeEmailSrc(photoUrl, 640, 200) : makeEmailSrc('public/img/invite.png'), inviteUrl),
        row([
            textCell(greeting(`Hi ${toName}`)),
            textCell(paragraph(`${fromName} nodigt je uit om lid te worden van <strong><span style="font-size: 16px;">${groupName}</span></strong> op
            clubalmanac`)),
            dividerCell(dividerSrc),
            textCell(paragraph(message.replace(/\n/g, '<br/>'))),
            dividerCell(dividerSrc),
            buttonCell('Bekijk uitnodiging', inviteUrl),
            textCell(buttonEscape(inviteUrl))
        ]),
        row([
            textCell(paragraph(`Deze uitnodiging is geldig tot ${expirationDate}`)),
            textCell(paragraph('We zien je graag terug op clubalmanac')),
            signatureCell(makeEmailSrc('public/img/signature_wouter.png'))
        ]),
        footerRow
    ])
);