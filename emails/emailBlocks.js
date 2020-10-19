// html string blocks to compose an email message
/*
    emailBody (rows)
    row (cells) | headerRow(logoSrc, frontendUrl) | footerRow | photoRow(photoSrc, linkUrl)
    cell can be:
        textCell(greeting | paragraph | buttonEscape)
        dividerCell(dividerSrc)
        buttonCell(text, link)
        codeCell(code)
        signatureCell(src)
*/

export const emailBody = (rows = []) => `
${blockOpen}
${rows.join('\n')}
${blockClose}
`;

export const row = (contents = []) => `
<div style="background-color:transparent;overflow:hidden">
<div class="block-grid"
style="min-width: 320px; max-width: 635px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: #ffffff;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:635px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="635" style="background-color:#ffffff;width:635px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12"
style="min-width: 320px; max-width: 635px; display: table-cell; vertical-align: top; width: 635px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
${contents.join('\n')}
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
`;

export const textCell = (textChild) => `
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Verdana, sans-serif"><![endif]-->
<div style="color:#5c5762;font-family:Verdana, Geneva, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
${textChild}
</div>
<!--[if mso]></td></tr></table><![endif]-->
`;

export const greeting = (text) => `
<div style="line-height: 1.2; font-size: 12px; color: #5c5762; font-family: Verdana, Geneva, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">
<strong><span style="font-size: 18px;">${text}</span></strong></p>
</div>
`;

export const paragraph = (text) => `
<div
style="line-height: 1.8; font-size: 12px; color: #5c5762; font-family: Verdana, Geneva, sans-serif; mso-line-height-alt: 22px;">
<p style="font-size: 14px; line-height: 1.8; word-break: break-word; mso-line-height-alt: 25px; margin: 0;">
${text}
</p></div>
`;

export const dividerCell = (dividerSrc) => `
<div align="center" class="img-container center autowidth"
style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
align="center" alt="Alternate text" border="0"
class="center autowidth" src="${dividerSrc}"
style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 67px; display: block;"
title="Alternate text" width="67" />
<!--[if mso]></td></tr></table><![endif]-->
</div>
`;

export const buttonCell = (text, url) => `
<div align="center" class="button-container"
style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:30pt; width:156pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#fdec00"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#000; font-family:Verdana, sans-serif; font-size:16px"><![endif]--><a
href="${url}"
style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #000; background-color: #fdec00; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: auto; width: auto; border-top: 1px solid #fdec00; border-right: 1px solid #fdec00; border-bottom: 1px solid #fdec00; border-left: 1px solid #fdec00; padding-top: 04px; padding-bottom: 04px; font-family: Verdana, Geneva, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"
target="_blank"><span
style="padding-left:16px;padding-right:16px;font-size:16px;display:inline-block;"><span
style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">${text}</span></span></a>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
`;

export const codeCell = (code) => `
<div align="center" class="button-container"
style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:30pt; width:156pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#fdec00"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#000; font-family:Verdana, sans-serif; font-size:16px"><![endif]-->
<div style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #000; background-color: tranparent; width: auto; width: auto; border-top: 2px solid #0097a7; border-bottom: 2px solid #0097a7; padding-top: 04px; padding-bottom: 04px; font-family: Verdana, Geneva, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"
target="_blank"><span
style="padding-left:16px;padding-right:16px;font-size:16px;display:inline-block;"><span
style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">${code}</span></span></div>
<!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>
`;


export const buttonEscape = (url) => `
<div style="line-height: 1.2; font-size: 12px; color: #5c5762; font-family: Verdana, Geneva, sans-serif; mso-line-height-alt: 14px;">
<p style="font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin: 0;">
<span style="font-size: 12px;">Als de button niet werkt, probeer
dan onderstaande link te kopiëren naar je browser</span></p>
<a href="${url}" rel="noopener"
style="text-decoration: underline; color: #0097a7;"
target="_blank">${url}</a>
</div>
`;

export const signatureCell = (src) => `
<div align="left" class="img-container left fixedwidth"
style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="left"><![endif]--><img
alt="Alternate text" border="0" class="left fixedwidth"
src="${src}"
style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 127px; display: block;"
title="Alternate text" width="127" />
<!--[if mso]></td></tr></table><![endif]-->
</div>
`;

export const headerRow = (logoSrc, frontendUrl) => `
<div style="background-color:transparent;overflow:hidden">
<div class="block-grid"
style="min-width: 320px; max-width: 635px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: transparent;">
<div
style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:635px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="635" style="background-color:transparent;width:635px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;">
<![endif]-->
<div class="col num12"
style="min-width: 320px; max-width: 635px; display: table-cell; vertical-align: top; width: 635px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div
style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="left" class="img-container left autowidth"
style="padding-right: 5px;padding-left: 5px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 5px;padding-left: 5px;" align="left"><![endif]-->
<div style="font-size:1px;line-height:5px"></div><a href="${frontendUrl}" style="outline:none" tabindex="-1"
target="_blank"> <img alt="logo clubalmanac" border="0"
class="left autowidth" src="${logoSrc}"
style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 119px; display: block;"
title="logo clubalmanac" width="119" /></a>
<div style="font-size:1px;line-height:5px"></div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
`;

export const footerRow = `
<div style="background-color:transparent;overflow:hidden">
<div class="block-grid"
style="min-width: 320px; max-width: 635px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: transparent;">
<div
style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:635px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="635" style="background-color:transparent;width:635px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12"
style="min-width: 320px; max-width: 635px; display: table-cell; vertical-align: top; width: 635px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div
style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Verdana, sans-serif"><![endif]-->
<div
style="color:#5c5762;font-family:Verdana, Geneva, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div
style="line-height: 1.2; font-size: 12px; color: #5c5762; font-family: Verdana, Geneva, sans-serif; mso-line-height-alt: 14px;">
<p
style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 17px; margin: 0;">
© clubalmanac 2020</p>
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 17px; margin: 0;"></p>
<p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 17px; margin: 0;">
<a href="https://clubalmanac.com/about" rel="noopener"
style="text-decoration: underline; color: #0097a7;"
target="_blank">over ons</a> | <a
href="https://clubalmanac.com/about#privacy" rel="noopener"
style="text-decoration: underline; color: #0097a7;"
target="_blank">privacy statement</a></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
`;

export const photoRow = (photoSrc, linkUrl) => `
<div style="background-color:transparent;overflow:hidden">
<div class="block-grid"
style="min-width: 320px; max-width: 635px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: transparent;">
<div
style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:635px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="635" style="background-color:transparent;width:635px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
<div class="col num12"
style="min-width: 320px; max-width: 635px; display: table-cell; vertical-align: top; width: 635px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div
style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth"
style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><a
href="${linkUrl}" style="outline:none" tabindex="-1"
target="_blank"> <img align="center" alt="invite icon" border="0"
class="center autowidth" src="${photoSrc}"
style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 635px; display: block;"
title="invite icon" width="635" /></a>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
`;

export const blockOpen = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width" name="viewport"/>
<!--[if !mso]><!-->
<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<!--<![endif]-->
<title></title>
<!--[if !mso]><!-->
<!--<![endif]-->
<style type="text/css">
body {
margin: 0;
padding: 0;
}

table,
td,
tr {
vertical-align: top;
border-collapse: collapse;
}

* {
line-height: inherit;
}

a[x-apple-data-detectors=true] {
color: inherit !important;
text-decoration: none !important;
}
</style>
<style id="media-query" type="text/css">
@media (max-width: 655px) {

.block-grid,
.col {
min-width: 320px !important;
max-width: 100% !important;
display: block !important;
}

.block-grid {
width: 100% !important;
}

.col {
width: 100% !important;
}

.col>div {
margin: 0 auto;
}

img.fullwidth,
img.fullwidthOnMobile {
max-width: 100% !important;
}

.no-stack .col {
min-width: 0 !important;
display: table-cell !important;
}

.no-stack.two-up .col {
width: 50% !important;
}

.no-stack .col.num2 {
width: 16.6% !important;
}

.no-stack .col.num3 {
width: 25% !important;
}

.no-stack .col.num4 {
width: 33% !important;
}

.no-stack .col.num5 {
width: 41.6% !important;
}

.no-stack .col.num6 {
width: 50% !important;
}

.no-stack .col.num7 {
width: 58.3% !important;
}

.no-stack .col.num8 {
width: 66.6% !important;
}

.no-stack .col.num9 {
width: 75% !important;
}

.no-stack .col.num10 {
width: 83.3% !important;
}

.video-block {
max-width: none !important;
}

.mobile_hide {
min-height: 0px;
max-height: 0px;
max-width: 0px;
display: none;
overflow: hidden;
font-size: 0px;
}

.desktop_hide {
display: block !important;
max-height: none !important;
}
}
</style>
</head>
<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #d5c6c3;">
<!--[if IE]><div class="ie-browser"><![endif]-->
<table bgcolor="#d5c6c3" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #d5c6c3; width: 100%;"
valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top;" valign="top">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#d5c6c3"><![endif]-->
`;

export const blockClose = `
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!--[if (IE)]></div><![endif]-->
</body>
</html>
`;