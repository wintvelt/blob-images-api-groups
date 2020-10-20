import {
    dividerCell, emailBody, row, textCell,
    footerRow, greeting, headerRow, paragraph, photoRow, signatureCell, makeEmailSrc, codeCell
} from 'blob-common/core/email';

const dividerSrc = makeEmailSrc('public/img/invite_divider.png');
const frontEndUrl = process.env.frontend || process.env.devFrontend || 'http://localhost:3000';

export const memberUpdateBody = ({ toName, fromName, groupName, photoUrl, groupId, newRole }) => {
    const url = `${frontEndUrl}/personal/groups/${groupId}`;
    const role = (newRole === 'admin') ? 'admin' : 'gast';
    const explanation = (newRole == 'admin') ?
        `Dat betekent dat je nu albums kunt toevoegen en bewerken, foto\'s kunt toevoegen<br/>
    Je kunt ook leden uitnodigen en bewerken, en de groep zelf aanpassen.`
        : `Dat betekent dat je alles in de groep kunt bekijken, maar dat je geen aanpassingen meer kunt doen<br/>
    Als je foto\'s had gedeeld, zijn deze verwijderd uit de groep. (Dacht ik?)`;

    return emailBody([
        headerRow(makeEmailSrc('public/img/logo_email_1.png'), frontEndUrl),
        (photoUrl) ? photoRow(makeEmailSrc(photoUrl, 640, 200), url) : '',
        row([
            textCell(greeting(`Hi ${toName}`)),
            textCell(paragraph(`${fromName} heeft je rechten voor de groep <strong><span style="font-size: 16px;">${groupName}</span></strong> aangepast`)),
            textCell(paragraph('Je nieuwe rol in de groep is nu')),
            codeCell(role),
            textCell(paragraph(explanation)),
        ]),
        row([
            dividerCell(dividerSrc),
            textCell(paragraph('We zien je graag terug op clubalmanac')),
            signatureCell(makeEmailSrc('public/img/signature_wouter.png'))
        ]),
        footerRow
    ]);
};

export const memberUpdateText = ({ toName, fromName, groupName, groupId, newRole }) => {
    const url = `${frontEndUrl}/personal/groups/${groupId}`;
    const role = (newRole === 'admin') ? 'admin' : 'gast';
    return `Hi ${toName}, ${fromName} heeft je rechten als lid van "${groupName}" aangepast. 
    Je bent nu (${role}). Graag zien we je snel terug bij clubalmanac op ${url}.`;
};

export const memberUpdateSubject = ({ fromName, groupName, newRole }) => {
    const role = (newRole === 'admin') ? 'admin' : 'gast';
    return `${fromName} heeft jouw rechten als lid van "${groupName}" aangepast naar (${role})`;
};
