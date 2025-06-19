import { errors } from '@strapi/utils';
const { ForbiddenError } = errors;

function isJSON(str) {
	try {
		let newJson = JSON.parse(str);
		return (typeof newJson === 'object' && newJson !== str) || false;
	} catch (e) {
		return false;
	}
}

export default {
	async beforeCreate(event) {},
	async afterCreate(event) {
		const { result } = event;

		if (!result.id) {
			throw new ForbiddenError('No form');
		}

		const settings = await strapi.documents('plugin::api-forms.setting').findFirst();
		const defaultEmail = await strapi.plugins['email'].services.email.getProviderSettings().settings.defaultFrom;

		const tableRows = result.steps
			.map((step) => {
				if (!step.layouts.lg) {
					return '';
				}

				return step.layouts.lg.map((block) => {
					const { field } = block;

					if (field.type === 'file') {
						return '';
					}

					return `<tr><td><strong>${field.label}</strong></td><td>{{${field.name}}}</td></tr>`;
				});
			})
			.join('');

		const htmlWithSubmission =
			settings && settings?.html
				? settings?.html?.replace(
						/(<td[^>]+contenteditable="false"[^>]*>)([\s\S]*?)(<\/td>)/i,
						`$1<table width="100%" cellpadding="0" cellspacing="0">${tableRows}</table>$3`
					)
				: tableRows;

		const message = `
<body style="margin:0; padding:0; background-color: ${settings?.htmlBgColor};" bgcolor="${settings?.htmlBgColor}">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${settings?.htmlBgColor}" style="background-color: ${settings?.htmlBgColor}; width: 100%;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px; margin:0 auto; background-color: ${settings?.htmlBgColor}">
          <tr>
            <td>
              ${htmlWithSubmission}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
`;

		const notification = await strapi.entityService.create('plugin::api-forms.notification', {
			data: {
				form: result.id,
				enabled: true,
				identifier: 'notification',
				service: 'emailService',
				from: settings && settings?.globalFromEmail ? `${settings.globalFromName} <${settings.globalFromEmail}>` : defaultEmail,
				to: settings && settings?.globalEmail ? settings.globalEmail : defaultEmail,
				message: message,
				subject: `New submission from API form: ${result.title}`,
			},
		});

		const confirmation = await strapi.entityService.create('plugin::api-forms.notification', {
			data: {
				form: result.id,
				enabled: false,
				identifier: 'confirmation',
				service: 'emailService',
				from: settings && settings?.globalFromEmail ? `${settings.globalFromName} <${settings.globalFromEmail}>` : defaultEmail,
				to: '',
				subject: `Thank you for your submission on form: ${result.title}`,
				message: message,
			},
		});

		return [confirmation, notification];
	},
};
