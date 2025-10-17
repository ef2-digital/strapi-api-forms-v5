import type { Core } from '@strapi/strapi';
import { format } from 'date-fns';

function compareDateWithToday(dateString: string, future: boolean = false) {
	const [day, month, year] = dateString.split('-');
	const isoDateString = `${year}-${month}-${day}`;
	const date = new Date(isoDateString);
	const todayDate = new Date();

	if (!future) {
		return date.getTime() < todayDate.getTime();
	}

	return date.getTime() > todayDate.getTime();
}

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
	strapi.cron.add({
		// runs every night at 00:00
		formActiveCheck: {
			task: async ({ strapi }) => {
				// Query for active forms with non-empty dateTill
				const activeForms = await strapi.db.query('plugin::api-forms.form').findMany({
					where: {
						active: true,
						$and: [{ date_till: { $not: '' } }], // Simplified condition
					},
				});

				// Filter out forms where dateTill is in the past
				const pastForms = activeForms.filter((form) => {
					// Validate dateTill
					if (!form.dateTill || !form.dateTill.includes('T')) return false;

					const [datePart] = form.dateTill.split('T'); // Safely split dateTill
					return compareDateWithToday(datePart); // Check if form date is in the past
				});

				// Update all past forms to set active = false
				await Promise.all(
					pastForms.map((form) =>
						strapi.db.query('plugin::api-forms.form').update({
							where: { id: form.id },
							data: { active: false },
						})
					)
				);

				// Query for inactive forms
				const inActiveForms = await strapi.db.query('plugin::api-forms.form').findMany({
					where: {
						active: false,
					},
				});

				// Filter forms to activate based on date ranges
				const filteredInactiveForms = inActiveForms.filter((form) => {
					// Handle cases where both dateFrom and dateTill are empty
					if (!form.dateFrom && !form.dateTill) return true;

					const isInPast = form.dateFrom
						? compareDateWithToday(form.dateFrom.split('T')[0]) // Validate dateFrom
						: true;

					const isInFuture = form.dateTill
						? compareDateWithToday(form.dateTill.split('T')[0], true) // Validate dateTill
						: true;

					return isInPast || isInFuture; // Activates form if it meets any condition
				});

				// Update all forms meeting criteria to set active = true
				await Promise.all(
					filteredInactiveForms.map((form) =>
						strapi.db.query('plugin::api-forms.form').update({
							where: { id: form.id },
							data: { active: true },
						})
					)
				);

				// Log success
				strapi.log.info('Finished form active CRON');
			},
			options: {
				rule: '0 0 * * *',
			},
		},
	});
};

export default bootstrap;
