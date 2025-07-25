//@ts-nocheck
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { Box, Flex, Grid, Button, LinkButton, Modal, Typography, VisuallyHidden } from '@strapi/design-system';
import { Cog, Eye, File, Mail, Message } from '@strapi/icons';
import { PLUGIN_ID } from '../pluginId';
import { getTranslation } from '../utils/getTranslation';
import { BackButton, Layouts, Page, Pagination, Table, useAuth, useQueryParams } from '@strapi/strapi/admin';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import submissionRequests from '../api/submission';

const Submission = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSubmission, setSelectedSubmission] = useState(null);

	const truncateValue = (value, maxLength = 100) => {
		if (typeof value === 'string' && value.length > maxLength) {
			return value.substring(0, maxLength) + '...'; // Truncate and add ellipsis
		}
		return value;
	};

	const handleOpenModal = (submission) => {
		console.log('Selected submission:', submission);
		setSelectedSubmission(submission);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedSubmission(null);
	};

	const { formatMessage } = useIntl();
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState(null);

	const [results, setResults] = useState([]);
	const [pagination, setPagination] = useState([]);

	const token = useAuth('Admin', (state) => state.token);

	if (!token) {
		return <Page.Loading />;
	}

	const [{ query }, querySet] = useQueryParams<{
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
				const response = await submissionRequests.getSubmissions(token, query);
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
	}, [navigate]);

	useEffect(() => {
		const fetchForms = async () => {
			setIsFetching(true);
			try {
				const response = await submissionRequests.getSubmissions(token, query);
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
			id: getTranslation(`submission.title`),
		}),
		formatMessage({
			id: getTranslation(`list.creation_date`),
		}),
		<VisuallyHidden>Actions</VisuallyHidden>,
	];

	if (isFetching) {
		return <Page.Loading />;
	}

	if (error) {
		return <Page.Error />;
	}

	return (
		<>
			<Layouts.Root>
				<Page.Title>{formatMessage({ id: getTranslation('submissions.label') })}</Page.Title>
				{/* @ts-ignore */}
				<Page.Main style={{ position: 'relative' }}>
					<Layouts.Header
						title={formatMessage({ id: getTranslation('submissions.label') })}
						navigationAction={<BackButton disabled={undefined} />}
					/>

					<Layouts.Content>
						<Flex gap={4} style={{ marginBottom: '20px' }}>
							<LinkButton variant="tertiary" startIcon={<Mail />} to={`/plugins/${PLUGIN_ID}`} tag={NavLink}>
								{formatMessage({ id: getTranslation('forms.all') })}
							</LinkButton>
							<LinkButton variant="primary" startIcon={<Message />} to={`/plugins/${PLUGIN_ID}/submissions`} tag={NavLink}>
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
											<Table.Empty />
											<Table.Body>
												{results &&
													results.map((row: any) => {
														const creationDate = new Intl.DateTimeFormat('nl-NL', {
															year: 'numeric',
															month: 'long',
															day: 'numeric',
															hour: 'numeric',
															minute: 'numeric',
															second: 'numeric',
														}).format(new Date(row.publishedAt));

														const submission = Object.entries(row.submission).map((value, key) => `${value.join(': ')}  `);

														return (
															<Table.Row key={row.id}>
																<Table.Cell>
																	<Typography textColor="neutral800">{row.id}</Typography>
																</Table.Cell>
																<Table.Cell>
																	<Typography textColor="neutral800">
																		<div>{truncateValue(submission.join(' - '))}</div>
																	</Typography>
																</Table.Cell>
																<Table.Cell>
																	<Typography textColor="neutral800">{creationDate}</Typography>
																</Table.Cell>

																<Table.Cell>
																	<LinkButton variant="secondary" onClick={() => handleOpenModal(row)}>
																		<Flex gap={2} justifyContent="flex-start" alignItems="center">
																			<Eye />
																			View details
																		</Flex>
																	</LinkButton>
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
						<Modal.Root open={isModalOpen && selectedSubmission} onOpenChange={handleCloseModal}>
							<Modal.Content>
								<Modal.Header>
									<Typography variant="beta">Submission Details</Typography>
								</Modal.Header>
								<Modal.Body>
									{selectedSubmission?.submission && selectedSubmission?.form && (
										<Box padding={0}>
											<Box background="neutral100" padding={4} shadow="tableShadow" hasRadius>
												{Object.entries(selectedSubmission.submission).map(([key, value]) => {
													const allFields =
														selectedSubmission.form.steps?.flatMap((step) => step.layouts?.lg?.map((layout) => layout.field) || []) || [];
													const fieldConfig = allFields.find((f) => f.name === key);
													const label = fieldConfig?.label || key;

													return (
														<>
															<Box key={key} justifyContent="space-between" alignItems="flex-start" wrap="wrap">
																{/* Key */}
																<Typography fontWeight="bold" textColor="neutral800" style={{ flex: 1, maxWidth: '200px' }}>
																	{label}:
																</Typography>
															</Box>
															<Box marginBottom={4} justifyContent="space-between" alignItems="flex-start" wrap="wrap">
																{/* Value */}
																<Typography textColor="neutral800" style={{ flex: 2 }}>
																	{typeof value === 'object' ? (
																		<pre
																			style={{
																				margin: 0,
																				whiteSpace: 'pre-wrap',
																				wordWrap: 'break-word',
																			}}
																		>
																			{JSON.stringify(value, null, 2)}
																		</pre>
																	) : (
																		value || 'N/A'
																	)}
																</Typography>
															</Box>
														</>
													);
												})}
											</Box>
										</Box>
									)}
								</Modal.Body>
								<Modal.Footer>
									<Modal.Close>
										<Button variant="tertiary">{formatMessage({ id: getTranslation('close') })}</Button>
									</Modal.Close>
								</Modal.Footer>
							</Modal.Content>
						</Modal.Root>
					</Layouts.Content>
				</Page.Main>
			</Layouts.Root>
		</>
	);
};

export { Submission };
