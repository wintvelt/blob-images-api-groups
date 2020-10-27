import {
    buttonCell, buttonEscape, dividerCell, emailBody, row, textCell,
    footerRow, greeting, headerRow, paragraph, signatureCell, makeEmailSrc
} from 'blob-common/core/email';

const frontEndUrl = process.env.frontend || process.env.devFrontend || 'http://localhost:3000';
const myGroupsUrl = `${frontEndUrl}/personal/groups`;

export const uninviteBody = ({ toName, fromName, groupName, inviteWasToEmail }) => {
    const textBody = (inviteWasToEmail) ? `Jammer, maar misschien zijn er andere vrienden die je uitnodigen`
        : `Als je daar foto's had gedeeld, dan zijn deze verwijderd uit de albums van de groep.<br/>
Jammer, maar gelukkig ben je nog wel gewoon lid van clubalmanac<br/>
Via onderstaande knop kun je je andere groepen bekijken`;

    return emailBody([
        headerRow(makeEmailSrc('public/img/logo_email_1.png'), frontEndUrl),
        row([
            dividerCell(makeEmailSrc('public/img/banned.png')),
            textCell(greeting(`Hi ${toName}`)),
            textCell(paragraph(`${fromName} heeft de uitnodiging om lid te worden van <strong><span style="font-size: 16px;">${groupName}</span></strong> 
ingetrokken`)),
                textCell(paragraph(textBody)),
                (inviteWasToEmail)? '':  buttonCell('Bekijk groepen', myGroupsUrl),
                (inviteWasToEmail)? '':  textCell(buttonEscape(myGroupsUrl)),
        ]),
        row([
            textCell(paragraph('Hoogachtende groet namens clubalmanac')),
            signatureCell(makeEmailSrc('public/img/signature_wouter.png'))
        ]),
        footerRow
    ]);
};