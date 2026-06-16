export const getDefaultEmailHeader = () => `
  <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" role="presentation">
    <tr>
    <td width="15%">&nbsp;</td>
    <td width="70%" align="center">
       <p style="text-align: center">Logo placeholder</p>
      </td>
      <td width="15%">&nbsp;</td>
    </tr>
  </table>
`;

export const getDefaultEmailFooter = () => `
  <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" role="presentation">
    <tr>
     <td width="15%">&nbsp;</td>
    <td width="70%" align="center">
     <p style="text-align: center">
        Sincerly,<br />
        Your Company
        </p>
      </td>
     <td width="15%">&nbsp;</td>
    </tr>
  </table>
`;

export const getDefaultEmailBody = () => `
 <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" role="presentation">
    <tr>
     <td width="15%">&nbsp;</td>
    <td width="70%" align="center" id="emailBody">
     
      </td>
        <td width="15%">&nbsp;</td>
      </tr>
  </table>
`;

export const getDefaultEmailTemplate = () => `
  <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" role="presentation" style="width:600px; margin:0 auto; border-collapse:collapse;">
    <tr>
      <td width="15%" style="padding:0; margin:0; border:0;">&nbsp;</td>
      <td width="70%" align="center" style="text-align: center; padding:0; margin:0; border:0;">
        <p style="margin: 0; padding: 0;">Logo placeholder</p>
      </td>
      <td width="15%" style="padding:0; margin:0; border:0;">&nbsp;</td>
    </tr>
    <tr>
      <td width="15%" style="padding:0; margin:0; border:0;">&nbsp;</td>
      <td
        width="70%"
        align="center"
        contenteditable="false"
        data-submission-placeholder="true"
        style="padding: 0; margin: 0; border: 0;"
        readonly
      >
        <p style="margin: 0; text-align: center;">
          [SUBMISSION PLACEHOLDER]
        </p>
      </td>
      <td width="15%" style="padding:0; margin:0; border:0;">&nbsp;</td>
    </tr>
    <tr>
      <td width="15%" style="padding:0; margin:0; border:0;">&nbsp;</td>
      <td width="70%" align="center" style="text-align: center; padding:0; margin:0; border:0;">
        <p style="margin: 0; padding: 20px;">Thank you for your submission.</p>
      </td>
      <td width="15%" style="padding:0; margin:0; border:0;">&nbsp;</td>
    </tr>
  </table>
`;
