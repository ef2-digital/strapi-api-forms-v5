import { SubmissionType } from '../../admin/src/utils/types';

/**
 * Validate email format
 */
function validateEmail(emails: string): boolean {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emails.split(',').every((email) => emailPattern.test(email.trim()));
}

/**
 * Retrieve value from submission fields
 */
function getValueFromSubmissionByKey(key: string, submission: any): string {
	return submission[key] ?? '-';
}

/**
 * Replace placeholders in the email template
 */
function replaceDynamicVariables(message: string, submission: any): string {
	return message.replace(/{{(.*?)}}/g, (_, key) => {
		return submission[key] ?? '-';
	});
}

/**
 * Process file attachments for email
 */
async function getFiles(submission: SubmissionType, provider: string): Promise<any[]> {
	return Promise.all(
		submission.files.map(async (file) => {
			const isAbsoluteUrl = /^(https?:\/\/)/.test(file.url);
			const fileUrl = isAbsoluteUrl ? file.url : `${strapi.config.get('server.url')}${file.url}`;

			if (provider === 'mailgun') {
				try {
					const response = await fetch(fileUrl);
					const buffer = await response.arrayBuffer();
					return {
						filename: file.name,
						content: Buffer.from(buffer),
					};
				} catch (error) {
					strapi.log.error(`Failed to fetch file: ${fileUrl}`, error);
					return null;
				}
			} else {
				return { filename: file.name, path: fileUrl };
			}
		})
	).then((files) => files.filter(Boolean)); // Remove failed file fetches
}

export { validateEmail, getValueFromSubmissionByKey, replaceDynamicVariables, getFiles };
