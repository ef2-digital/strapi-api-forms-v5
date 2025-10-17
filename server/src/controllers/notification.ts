import { factories } from '@strapi/strapi';
import { faker } from '@faker-js/faker';
import { replaceDynamicVariables } from '../functions';
import { EmailSubmissionType } from '../../../admin/src/utils/types';

export default factories.createCoreController('plugin::api-forms.notification', ({ strapi }) => ({
	async findOne(ctx) {
		const data = await strapi.documents('plugin::api-forms.notification').findOne({ ...ctx.params, populate: { form: '*' } });
		return { data };
	},
	async test(ctx) {
		try {
			const { data } = ctx.request.body?.data;
			const { notificationId, email } = data;

			if (!notificationId) {
				return ctx.badRequest('ID is required.');
			}

			const notification = await strapi
				.documents('plugin::api-forms.notification')
				.findOne({ documentId: notificationId, populate: ['form'] });

			if (!notification) {
				return ctx.notFound('Notification not found.');
			}

			const form = await strapi.documents('plugin::api-forms.form').findOne({ documentId: notification.form.documentId });

			if (!form) {
				return ctx.notFound('Form not found.');
			}

			const submissionData = generateMockSubmission(form.steps);
			const message = replaceDynamicVariables(notification.message, submissionData);

			const emailSubmission: EmailSubmissionType = {
				to: email,
				from: notification.from,
				subject: notification.subject,
				html: message,
			};

			await strapi.plugin('email').service('email').send(emailSubmission);

			return ctx.send({ message: 'Test submission created!', data: { message } });
		} catch (error) {
			strapi.log.error('Test submission error:', error);
			console.dir(error, { depth: null });
			return ctx.internalServerError('Failed to process test submission.');
		}
	},
}));

function generateMockSubmission(steps) {
	const mockSubmission = {};

	steps.forEach((step) => {
		const fields = step.layouts.lg;
		fields.forEach(({ field }) => {
			switch (field.type) {
				case 'text':
					mockSubmission[field.name] = faker.person.firstName();
					break;
				case 'email':
					mockSubmission[field.name] = faker.internet.email();
					break;
				case 'number':
					mockSubmission[field.name] = faker.number.int({ min: 1, max: 1000 });
					break;
				case 'textarea':
					mockSubmission[field.name] = faker.lorem.sentences(2);
					break;
				case 'checkbox':
					mockSubmission[field.name] = faker.datatype.boolean();
					break;
				case 'checkboxgroup':
					mockSubmission[field.name] = field.options ? faker.helpers.arrayElements(field.options.map((opt) => opt.value)) : [];
					break;
				case 'radio':
					mockSubmission[field.name] = field.options ? faker.helpers.arrayElement(field.options.map((opt) => opt.value)) : 'default';
					break;
				case 'select':
					mockSubmission[field.name] = field.options ? faker.helpers.arrayElement(field.options.map((opt) => opt.value)) : 'default';
					break;
				case 'file':
					mockSubmission[field.name] = faker.image.urlPlaceholder({ width: 640, height: 480 });
					break;
				default:
					mockSubmission[field.name] = faker.word.words(2);
			}
		});
	});

	return mockSubmission;
}
