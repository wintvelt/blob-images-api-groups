import {
    buttonCell, buttonEscape, dividerCell, emailBody, row, textCell,
    footerRow, greeting, headerRow, paragraph, signatureCell, makeEmailSrc
} from 'blob-common/core/email';

const frontEndUrl = process.env.frontend || process.env.devFrontend || 'http://localhost:3000';
const myGroupsUrl = `${frontEndUrl}/personal/groups`;

export const leaveBody = ({ toName, groupName }) => (
    emailBody([
        headerRow(makeEmailSrc('public/img/logo_email_1.png'), frontEndUrl),
        row([
            dividerCell(makeEmailSrc('public/img/leave_group.png')),
            textCell(greeting(`Hi ${toName}`)),
            textCell(paragraph(`Je hebt je lidmaatschap van <strong><span style="font-size: 16px;">${groupName}</span></strong> 
opgezegd<br/>
Als je daar foto's had gedeeld, dan zijn deze verwijderd uit de albums van de groep.<br/>
Je hebt nu ook geen toegang meer tot de pagina's van ${groupName}<br/>
Via onderstaande knop kun je wel je andere groepen bekijken`)),
            buttonCell('Bekijk groepen', myGroupsUrl),
            textCell(buttonEscape(myGroupsUrl)),
        ]),
        row([
            textCell(paragraph('We zien je graag terug op clubalmanac')),
            signatureCell(makeEmailSrc('public/img/signature_wouter.png'))
        ]),
        footerRow
    ])
);