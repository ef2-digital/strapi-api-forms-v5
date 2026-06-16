//@ts-nocheck
/**
 *  service
 */
import { factories } from '@strapi/strapi';
import { AsyncParser } from '@json2csv/node';

export default factories.createCoreService('plugin::api-forms.submission', ({ strapi }) => ({
	async export(formId) {
		//@ts-ignore
		const entities = await strapi
			.documents('plugin::api-forms.form')
			.findFirst({ filters: { documentId: formId }, populate: { submissions: '*' } });

		if (!entities || entities.submissions.length === 0) {
			return;
		}

		const data = entities.submissions.map((result) => {
			return {
				...result.submission,
				createdAt: result.createdAt,
			};
		});

		const parser = new AsyncParser();

		return await parser.parse(data).promise();
	},

	async upload(file) {
		try {
			const createdFiles = await strapi.plugins.upload.services.upload.upload({
				data: {
					fileInfo: {
						name: file.name,
						caption: file.name,
						alternativeText: file.name,
					},
				},
				files: file,
			});

			return createdFiles[0];
		} catch (error) {
			strapi.log.error(error);
		}
	},
}));
