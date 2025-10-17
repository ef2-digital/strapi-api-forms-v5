/**
 *  controller
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::api-forms.submission', ({ strapi }) => ({
	async post(ctx) {
		try {
			const { form, submission, referer } = ctx.request.body;

			if (!form) {
				return ctx.badRequest('No data provided');
			}

			const files = [];

			if (!submission) {
				return ctx.badRequest('Invalid submission data');
			}

			const strapiForm = await strapi.documents('plugin::api-forms.form').findOne({ documentId: form });

			if (!strapiForm) {
				return ctx.badRequest('Form not found');
			}

			// Handle Multiple File Uploads (Strapi 5 format)
			if (ctx.request.files) {
				const uploadedFiles = await strapi
					.plugin('upload')
					.service('upload')
					.upload({
						data: {}, // Optional metadata
						files: Object.values(ctx.request.files).flat(), // Ensure it's an array
					});

				if (uploadedFiles?.length > 0) {
					files.push(...uploadedFiles); // Store the uploaded file references
				}
			}

			return await strapi.documents('plugin::api-forms.submission').create({
				data: {
					form: {
						connect: form,
					},
					submission: JSON.stringify(submission),
					files: files.map((file) => file.id), // Store only file IDsr
					referer,
				},
				populate: ['form', 'files'],
			});
		} catch (error) {
			strapi.log.error('Submission error:', error);
			return ctx.internalServerError(JSON.stringify(error.message, error.stack));
		}
	},

	async export(ctx) {
		const { id } = ctx.params;
		return {
			data: await strapi.plugin('api-forms').service('submission').export(id),
			filename: `export-${id}-${Math.random()}.csv`,
		};
	},
}));
