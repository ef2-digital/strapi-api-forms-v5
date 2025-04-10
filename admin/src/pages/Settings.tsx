import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { Flex, LinkButton } from '@strapi/design-system';
import { Cog, Mail, Message } from '@strapi/icons';
import { PLUGIN_ID } from '../pluginId';
import { getTranslation } from '../utils/getTranslation';
import { BackButton, Layouts, Page, unstable_useDocumentLayout, useAuth, useFetchClient, useNotification } from '@strapi/strapi/admin';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box } from '@strapi/design-system';
import DynamicField from '../components/Internal/DynamicField';
import { Grid } from '@strapi/design-system';
import { Formik, Form } from 'formik';
import { Button } from '@strapi/design-system';

interface FormValues {
	[key: string]: string; // Keys are field names, values are strings
}

const Settings = () => {
	const token = useAuth('Admin', (state) => state.token);
	const [isFetching, setIsFetching] = useState(true);
	const [formData, setFormData] = useState<any>(null);
	const [error, setError] = useState(null);

	const { get, post } = useFetchClient();
	const { toggleNotification } = useNotification();

	const navigate = useNavigate();

	const { formatMessage } = useIntl();
	const { edit } = unstable_useDocumentLayout('plugin::api-forms.setting');

	const fields = edit.layout.flat().flat();

	useEffect(() => {
		const fetch = async () => {
			setIsFetching(true);

			try {
				const { data } = await get(`/${PLUGIN_ID}/setting`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setFormData(data.data);
			} catch (error) {
				setError(error as any);
				console.info('Error fetching settings:', error);
			} finally {
				setIsFetching(false);
			}
		};

		fetch();
	}, [navigate]);

	if (!fields || !Boolean(fields.length) || isFetching) {
		return <Page.Loading />;
	}

	if (error) {
		return <Page.Error />;
	}

	const handleSubmit = async (values: FormValues, { setErrors }: any) => {
		try {
			const { data } = await post(`/${PLUGIN_ID}/setting`, {
				data: values,
			});

			setFormData(data.data);

			toggleNotification({
				type: 'success',
				message: 'Settings saved successfully',
			});
		} catch (error: any) {
			console.error('Error saving settings:', error);

			if (error?.response?.data?.error?.name === 'ValidationError') {
				const backendErrors = error.response.data.error.details.errors;

				const formikErrors = backendErrors.reduce((acc: any, curr: any) => {
					const fieldName = curr.path[0]; // assuming simple paths like globalFrom
					acc[fieldName] = curr.message;
					return acc;
				}, {});

				setErrors(formikErrors);
			}

			toggleNotification({
				type: 'warning',
				message: 'Failed to save settings',
			});
		}
	};

	return (
		<>
			<Layouts.Root>
				<Page.Title>{formatMessage({ id: getTranslation('settings.label') })}</Page.Title>
				{/* @ts-ignore */}
				<Page.Main style={{ position: 'relative' }}>
					<Layouts.Header
						title={formatMessage({ id: getTranslation('settings.label') })}
						navigationAction={<BackButton disabled={undefined} />}
					/>

					<Layouts.Content>
						<Flex gap={4} style={{ marginBottom: '20px' }}>
							<LinkButton variant="tertiary" startIcon={<Mail />} to={`/plugins/${PLUGIN_ID}`} tag={NavLink}>
								{formatMessage({ id: getTranslation('forms.all') })}
							</LinkButton>
							<LinkButton variant="tertiary" startIcon={<Message />} to={`/plugins/${PLUGIN_ID}/submissions`} tag={NavLink}>
								{formatMessage({ id: getTranslation('submissions.all') })}
							</LinkButton>
							<LinkButton variant="primary" startIcon={<Cog />} to={`/plugins/${PLUGIN_ID}/settings`} tag={NavLink}>
								{formatMessage({ id: getTranslation('settings') })}
							</LinkButton>
						</Flex>
						<Formik
							initialValues={(({ id, createdAt, updatedAt, publishedAt, documentId, ...rest }) => rest)(formData)}
							onSubmit={handleSubmit}
						>
							{({ handleSubmit }) => (
								<Form onSubmit={handleSubmit}>
									<Box
										key={0}
										hasRadius
										background="neutral0"
										shadow="tableShadow"
										paddingLeft={6}
										paddingRight={6}
										paddingTop={6}
										paddingBottom={6}
										borderColor="neutral150"
									>
										<Grid.Root gap={4} style={{ width: '100%', marginBottom: '20px' }}>
											{fields.map((config, i) => (
												<DynamicField key={i} config={config} />
											))}
										</Grid.Root>
										<Button type="submit">{formatMessage({ id: getTranslation('save') })}</Button>
									</Box>
								</Form>
							)}
						</Formik>
					</Layouts.Content>
				</Page.Main>
			</Layouts.Root>
		</>
	);
};

export { Settings };
