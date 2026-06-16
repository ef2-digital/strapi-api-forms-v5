import { useState, useEffect } from 'react';

/*
 * Strapi Design system
 */
import { Button, Box, Divider, Modal, TextInput, Flex, Field, Switch, Alert, Typography } from '@strapi/design-system';

import { useIntl } from 'react-intl';
import { HandlerTypeEnum } from '../../utils/enums';
import { NotificationType } from '../../utils/types';
import { useFormContext } from '../../context/FormContext';
import { PLUGIN_ID } from '../../pluginId';
import { getTranslation } from '../../utils/getTranslation';
import SelectEmail from '../Fields/SelectEmail';
import notificationRequests from '../../api/notification';
import { useAuth } from '@strapi/strapi/admin';
import RichTextEditor from '../Fields/RichTextField';

interface ModalProps {
	formId: number;
	currentNotification: NotificationType;
	isModalVisible: boolean;
	setModalIsVisible: Function;
}

const NotificationModal = ({ formId, currentNotification, isModalVisible, setModalIsVisible }: ModalProps) => {
	const token = useAuth('Admin', (state) => state.token);
	const [notification, setNotification] = useState<NotificationType | null>(currentNotification);
	const { formatMessage } = useIntl();
	const { state, dispatch } = useFormContext();
	const [hasAlert, setAlert] = useState<boolean>(false);
	const [loading, setIsLoading] = useState<boolean>(true);
	const [alertMessage, setAlertMessage] = useState<string>(formatMessage({ id: `${PLUGIN_ID}.required` }));
	const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);
	const [testEmail, setTestEmail] = useState<string | ''>('');

	if (!notification) {
		return <></>;
	}

	useEffect(() => {
		notificationRequests
			.get(token!, notification.documentId)
			.then((res) => {
				dispatch({
					type: 'EDIT_FORM',
					payload: res.form,
				});

				setNotification(res);
			})
			.finally(() => setIsLoading(false));
	}, []);

	const setValue = (name: string, value: string | boolean) => {
		console.log(name, value);
		const record = { ...notification, [name]: value };

		setNotification(record);
	};

	const closeModal = () => {
		setModalIsVisible(false);
	};

	const save = async () => {
		await notificationRequests.update(token!, notification?.documentId, notification);
		closeModal();
	};

	/**
	 * Trigger test email by simulating a submission
	 */
	const sendTestEmail = async () => {
		setTestEmailStatus('Sending...');

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!testEmail || !emailRegex.test(testEmail)) {
			setTestEmailStatus('❌ Please provide a valid email address.');
			return;
		}

		try {
			const response = await notificationRequests.test(token!, notification?.documentId, testEmail);

			if (!response.ok) {
				throw new Error('Failed to send test email');
			}

			setTestEmailStatus('✅ Test email sent successfully!');
		} catch (error) {
			console.error('Test email error:', error);
			setTestEmailStatus('❌ Failed to send test email.');
		}

		setTimeout(() => setTestEmailStatus(null), 5000);
	};

	if (!isModalVisible || !notification || !state || loading) {
		return <></>;
	}

	return (
		<Modal.Root open={isModalVisible} onOpenChange={closeModal}>
			<Modal.Content>
				<Modal.Header>
					<Flex direction="column" gap={4} alignItems="stretch" width="100%">
						<Modal.Title>E-mail</Modal.Title>
					</Flex>
				</Modal.Header>
				<Modal.Body>
					<Flex direction="column" gap={4} alignItems="stretch" width="100%">
						<Switch
							onCheckedChange={(checked: boolean) => setValue('enabled', checked)}
							visibleLabels
							defaultChecked={notification.enabled}
						/>

						<Field.Root name="from" id="from" error={hasAlert ? alertMessage : ''}>
							<Field.Label>{formatMessage({ id: getTranslation('forms.fields.from') })}</Field.Label>
							<TextInput
								name="from"
								value={notification.from}
								onChange={(e: any) => {
									setValue('from', e.target.value);
								}}
							/>
						</Field.Root>

						<Field.Root name="to" id="to" error={hasAlert ? alertMessage : ''}>
							<Field.Label>{formatMessage({ id: getTranslation('forms.fields.recipient') })}</Field.Label>

							{notification.identifier === HandlerTypeEnum.Notification ? (
								<TextInput
									name="to"
									value={notification.to}
									onChange={(e: any) => {
										setValue('to', e.target.value);
									}}
								/>
							) : (
								<SelectEmail notification={notification} setValue={setValue} />
							)}
						</Field.Root>

						<Field.Root>
							<Field.Label>
								{formatMessage({
									id: getTranslation('forms.fields.subject'),
								})}
							</Field.Label>
							<TextInput
								name="subject"
								value={notification.subject}
								onChange={(e: any) => {
									setValue('subject', e.target.value);
								}}
							/>
						</Field.Root>

						<Divider />

						<RichTextEditor
							value={notification.message}
							onChange={(value) => setValue('message', value)}
							availableFields={state.steps[0].layouts.lg}
						/>
					</Flex>
				</Modal.Body>

				<Modal.Footer>
					<Box style={{ width: '100%' }}>
						<Flex alignItems="center" justifyContent="space-between" style={{ width: '100%' }}>
							<Typography variant="pi" style={{ width: '25%' }}>
								{formatMessage({ id: getTranslation('forms.fields.test_email.label') })}
							</Typography>
							<Box flex={1} style={{ margin: '0 16px' }}>
								<TextInput
									name="test"
									value={testEmail}
									onChange={(e: any) => {
										setTestEmail(e.target.value);
									}}
								/>
							</Box>
							<Button variant="secondary" onClick={sendTestEmail}>
								{formatMessage({
									id: getTranslation('forms.fields.test_email.send'),
								})}
							</Button>
						</Flex>
					</Box>

					{testEmailStatus && (
						<Alert variant="info" style={{ width: '100%' }}>
							{testEmailStatus}
						</Alert>
					)}
				</Modal.Footer>
				<Modal.Footer>
					<Modal.Close>
						<Button variant="tertiary">{formatMessage({ id: getTranslation('close') })}</Button>
					</Modal.Close>

					<Button onClick={save}>{formatMessage({ id: getTranslation('save') })}</Button>
				</Modal.Footer>
			</Modal.Content>
		</Modal.Root>
	);
};

export default NotificationModal;
