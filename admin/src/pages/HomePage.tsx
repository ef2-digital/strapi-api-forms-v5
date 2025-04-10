//@ts-nocheck
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import formRequests from '../api/form';
import { Badge, Box, Button, Dialog, Flex, Grid, LinkButton, Typography, VisuallyHidden } from '@strapi/design-system';
import { Cog, Mail, Message, Pencil, Plus, Trash, WarningCircle } from '@strapi/icons';
import { PLUGIN_ID } from '../pluginId';
import { getTranslation } from '../utils/getTranslation';
import { BackButton, Layouts, Page, Pagination, Table, useAuth, useQueryParams } from '@strapi/strapi/admin';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import ExportButton from '../components/Buttons/ExportButton';
import NotificationButtonGroup from '../components/Buttons/HandlerButtonGroup';
import NotificationModal from '../components/Modals/NotificationModal';
import { NotificationType } from '../utils/types';
import { FormProvider } from '../context/FormContext';
import GenerateForm from '../components/Buttons/GenerateForm';

export const formatDate = (dateString) => {
	return dateString.split('T')[0];
};

const HomePage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const token = useAuth('Admin', (state) => state.token);
	const { formatMessage } = useIntl();

	// states
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState(null);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);

	const [isModalVisible, setModalIsVisible] = useState(false);
	const [handlerType, setHandlerType] = useState<NotificationType | null>(null);

	const [results, setResults] = useState([]);
	const [pagination, setPagination] = useState([]);

	const [fetchForms, setFetchForms] = useState(false);

	const [{ query }] = useQueryParams<{
		page?: number;
		pageSize?: number;
	}>({
		page: 1,
		pageSize: 10,
	});

	useEffect(() => {
		const fetchForms = async () => {
			setIsFetching(true);
			try {
				const response = await formRequests.getForms(token, query);
				setResults(response.data);
				setPagination(response.meta?.pagination);
			} catch (error) {
				setResults([]);
				setPagination(null);
				setError(error);
			} finally {
				setIsFetching(false);
			}
		};

		fetchForms();
	}, [navigate, fetchForms]);

	useEffect(() => {
		const fetchForms = async () => {
			setIsFetching(true);
			try {
				const response = await formRequests.getForms(token, query);
				setResults(response.data);
				setPagination(response.meta?.pagination);
			} catch (error) {
				setResults([]);
				setPagination(null);
				setError(error);
			} finally {
				setIsFetching(false);
			}
		};

		fetchForms();
	}, [location.search]);

	const tableHeaders: any = [
		'#',
		formatMessage({
			id: getTranslation(`list.name`),
		}),
		formatMessage({
			id: getTranslation(`list.creation_date`),
		}),
		formatMessage({
			id: getTranslation(`list.submissions`),
		}),
		formatMessage({
			id: getTranslation(`list.handlers`),
		}),
		formatMessage({
			id: getTranslation(`list.active`),
		}),
		<VisuallyHidden>Actions</VisuallyHidden>,
	];

	const handleDeleteClick = (row: any) => {
		setSelectedRow(row);

		setIsDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedRow && !token) {
			return;
		}

		try {
			await formRequests.deleteForm(token, selectedRow.documentId);
			setResults(results.filter((result) => result.id !== selectedRow.id));
			setIsDialogOpen(false);
		} catch (error) {
			console.error('Error deleting form:', error);
		}
	};

	if (isFetching) {
		return <Page.Loading />;
	}

	if (error) {
		return <Page.Error />;
	}

	return (
		<>
			<Layouts.Root>
				<Page.Title>{formatMessage({ id: getTranslation('heading.menu') })}</Page.Title>
				{/* @ts-ignore */}
				<Page.Main style={{ position: 'relative' }}>
					<Layouts.Header
						title={formatMessage({ id: getTranslation('forms.label') })}
						primaryAction={
							<Flex gap={4}>
								<GenerateForm onGenerateSuccess={setFetchForms} />
								<LinkButton startIcon={<Plus style={{ fill: 'white' }} />} href={`/admin/plugins/${PLUGIN_ID}/form`}>
									{formatMessage({
										id: getTranslation('forms.subtitle'),
									})}
								</LinkButton>
							</Flex>
						}
						navigationAction={<BackButton disabled={undefined} />}
					/>

					<Layouts.Content>
						<Flex gap={4} style={{ marginBottom: '20px' }}>
							<LinkButton variant="primary" startIcon={<Mail />} to={`/plugins/${PLUGIN_ID}`} tag={NavLink}>
								{formatMessage({ id: getTranslation('forms.all') })}
							</LinkButton>
							<LinkButton variant="tertiary" startIcon={<Message />} to={`/plugins/${PLUGIN_ID}/submissions`} tag={NavLink}>
								{formatMessage({ id: getTranslation('submissions.all') })}
							</LinkButton>
							<LinkButton variant="tertiary" startIcon={<Cog />} to={`/plugins/${PLUGIN_ID}/settings`} tag={NavLink}>
								{formatMessage({ id: getTranslation('settings') })}
							</LinkButton>
						</Flex>

						<Grid.Root>
							<Grid.Item col={12} s={12}>
								<Box style={{ width: '100%' }}>
									<Table.Root rows={results} headers={tableHeaders} isLoading={isFetching}>
										<Table.Content>
											<Table.Head>
												{tableHeaders.map((header: any, index) => (
													<Table.HeaderCell key={index} name={header} label={header} />
												))}
											</Table.Head>
											<Table.Loading />
											<Table.Empty
												action={
													<LinkButton startIcon={<Plus style={{ fill: 'white' }} />} href={`/admin/plugins/${PLUGIN_ID}/form/add`}>
														{formatMessage({
															id: getTranslation('forms.subtitle'),
														})}
													</LinkButton>
												}
											/>
											<Table.Body>
												{results &&
													results.map((row: any) => {
														const formattedDate = new Intl.DateTimeFormat('nl-NL', {
															year: 'numeric',
															month: 'long',
															day: 'numeric',
															hour: 'numeric',
															minute: 'numeric',
															second: 'numeric',
														}).format(new Date(row.createdAt));
														const formattedDateFrom = row.dateFrom ? formatDate(row.dateFrom) : '';
														const formattedDateTill = row.dateTill ? formatDate(row.dateTill) : '';

														return (
															<Table.Row key={row.id}>
																<Table.Cell>
																	<Typography textColor="neutral800">{row.id}</Typography>
																</Table.Cell>
																<Table.Cell>
																	<Typography textColor="neutral800">{row.title}</Typography>
																</Table.Cell>
																<Table.Cell>
																	<Typography textColor="neutral800">{formattedDate}</Typography>
																</Table.Cell>
																<Table.Cell>
																	<Flex gap={2} justifyContent="flex-start">
																		<LinkButton
																			disabled={row.submissions.length === 0}
																			variant="secondary"
																			to={`form/${row.documentId}/submissions`}
																			startIcon={<Mail />}
																			tag={NavLink}
																		>
																			{row.submissions.length}
																		</LinkButton>
																		<ExportButton formId={row.documentId} disabled={row.submissions.length === 0} />
																	</Flex>
																</Table.Cell>
																<Table.Cell>
																	<Flex gap={2} justifyContent="flex-start">
																		{Boolean(row.notifications!.length) && (
																			<NotificationButtonGroup
																				notifications={row.notifications}
																				setModalIsVisible={setModalIsVisible}
																				setHandlerType={setHandlerType}
																			/>
																		)}
																	</Flex>
																</Table.Cell>
																<Table.Cell>
																	<Flex gap={2} justifyContent="flex-start">
																		{row.active}
																		<Badge active={row.active}>
																			{formatMessage({
																				id: getTranslation(`list.${row.active ? 'active' : 'inactive'}`),
																			})}
																		</Badge>
																		{row.dateFrom || row.dateTill ? (
																			<>
																				{formattedDateFrom} - {formattedDateTill}
																			</>
																		) : (
																			<></>
																		)}
																	</Flex>
																</Table.Cell>
																<Table.Cell>
																	<Flex gap={2} justifyContent="flex-end">
																		<LinkButton
																			href={`/admin/plugins/${PLUGIN_ID}/form/${row.documentId}`}
																			startIcon={<Pencil />}
																			style={{ fill: 'white', color: 'white' }}
																		>
																			{formatMessage({ id: getTranslation('actions.edit') })}
																		</LinkButton>
																		<LinkButton
																			variant="danger"
																			startIcon={<Trash />}
																			onClick={() => handleDeleteClick(row)}
																			style={{ fill: 'white', color: 'white' }}
																		>
																			{formatMessage({ id: getTranslation('actions.delete') })}
																		</LinkButton>
																	</Flex>
																</Table.Cell>
															</Table.Row>
														);
													})}
											</Table.Body>
										</Table.Content>
									</Table.Root>
									{
										<Pagination.Root {...pagination} defaultPageSize={10}>
											<Pagination.PageSize />
											<Pagination.Links />
										</Pagination.Root>
									}
								</Box>
							</Grid.Item>
						</Grid.Root>
						{isModalVisible && handlerType && (
							<FormProvider>
								<NotificationModal
									currentNotification={handlerType}
									isModalVisible={isModalVisible}
									setModalIsVisible={setModalIsVisible}
								/>
							</FormProvider>
						)}
						<Dialog.Root open={isDialogOpen} onDismiss={() => setIsDialogOpen(false)}>
							<Dialog.Content>
								<Dialog.Header>{formatMessage({ id: getTranslation('dialog.delete.text') })}</Dialog.Header>
								<Dialog.Body icon={<WarningCircle fill="danger600" />}>
									{formatMessage({ id: getTranslation('dialog.delete.description') })}
								</Dialog.Body>
								<Dialog.Footer>
									<Dialog.Cancel>
										<Button fullWidth variant="tertiary" onClick={() => setIsDialogOpen(false)}>
											{formatMessage({ id: getTranslation('dialog.cancel') })}
										</Button>
									</Dialog.Cancel>
									<Dialog.Action>
										<Button fullWidth variant="danger-light" onClick={handleDeleteConfirm}>
											{formatMessage({ id: getTranslation('dialog.confirm') })}
										</Button>
									</Dialog.Action>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
					</Layouts.Content>
				</Page.Main>
			</Layouts.Root>
		</>
	);
};

export { HomePage };
