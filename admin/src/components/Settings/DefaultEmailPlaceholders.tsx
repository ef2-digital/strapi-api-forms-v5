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

export const getDefaultEmailTemplate = (
	body = ' <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" role="presentation"></table>'
) => {
	return getDefaultEmailHeader() + body + getDefaultEmailFooter();
};
