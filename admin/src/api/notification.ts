//@ts-nocheck
import fetchInstance from '../utils/fetch';
import { NotificationRequest, NotificationType } from '../utils/types';

const notificationRequests = {
	update: async (token: string, id: any, formData?: object): Promise<NotificationRequest> => {
		const body = formData;

		delete body.id;
		delete body.documentId;
		delete body.createdAt;
		delete body.updatedAt;
		delete body.publishedAt;
		delete body.form;

		const data = await fetchInstance(`notifications/update/${id}`, token, 'PUT', null, body, true);

		const notification = await data.json();

		return notification.data;
	},

	get: async (token: string, id: string): Promise<NotificationType> => {
		const data = await fetchInstance(`notifications/${id}`, token, 'GET', null, null, true);

		const notification = await data.json();

		return notification.data;
	},

	test: async (token: string, id: string, email: string): Promise<any> => {
		return await fetchInstance(
			`notifications/test/${id}`,
			token,
			'POST',
			null,
			{
				data: {
					notificationId: id,
					email,
				},
			},
			true
		);
	},
};

export default notificationRequests;
