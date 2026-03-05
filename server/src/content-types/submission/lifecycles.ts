import { errors } from '@strapi/utils';
const { ForbiddenError } = errors;

export default {
  /**
   * Before creating a submission, validate and remove spam attempts.
   */
  async beforeCreate(event) {
    try {
      const { params } = event;

      if (!params?.data?.submission) {
        throw new ForbiddenError('No submission provided');
      }

      // Parse submission data
      const submission = JSON.parse(params.data.submission);

      // ✅ Honeypot Spam Protection
      const honeypotField = Object.keys(submission).find((key) => key.includes('honeypot'));

      if (honeypotField && submission[honeypotField] !== '') {
        throw new ForbiddenError('Spam detected (honeypot filled)');
      }

      // Remove honeypot field
      delete submission[honeypotField];

      // ✅ Update submission data
      params.data.submission = JSON.stringify(submission);
    } catch (error) {
      strapi.log.error('beforeCreate error:', error);
      throw new ForbiddenError('Failed to process submission.');
    }
  },

  /**
   * After creating a submission, process notifications.
   */
  async afterCreate(event) {
    try {
      const { result, params } = event;

      if (!result || !params.data.form || params.data.form.connect.length === 0) {
        throw new ForbiddenError('No submission found');
      }

      const formId = params.data.form.connect[0].id;

      if (!formId) {
        throw new ForbiddenError('No form found');
      }

      // // ✅ Fetch the related form with notifications
      const form = await strapi.documents('plugin::api-forms.form').findFirst({
        filters: { id: formId },
        populate: ['notifications'],
      });

      if (!form?.notifications?.length) {
        return;
      }

      // // ✅ Filter enabled notifications
      const enabledNotifications = form.notifications.filter((handler) => handler.enabled);

      if (enabledNotifications.length === 0) {
        return;
      }

      // ✅ Process notifications sequentially (ensuring await works correctly)
      for (const handler of enabledNotifications) {
        if (!handler.service) {
          continue;
        }

        try {
          const response = await strapi
            .plugin('api-forms')
            .service('notification')
            .process(handler, result, form);

          strapi.log.info(`Notification sent successfully: ${JSON.stringify(response)}`);
        } catch (error) {
          strapi.log.error('Notification sending failed:', console.dir(error, { depth: null }));
        }
      }
    } catch (error) {
      strapi.log.error('afterCreate error:', error);
      console.dir(error, { depth: null });
      throw new ForbiddenError('Failed to process notifications.');
    }
  },
};
