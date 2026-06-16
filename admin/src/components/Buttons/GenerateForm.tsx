import { Button, Dialog, Field, Flex, Textarea, Typography } from '@strapi/design-system';
import { Magic as MagicWand } from '@strapi/icons';
import { useEffect, useState } from 'react';
import { useAuth } from '@strapi/strapi/admin';
import formRequests from '../../api/form';

const GenerateForm = ({ onGenerateSuccess }: { onGenerateSuccess: Function }) => {
	const [hasAISettings, setHasAISettings] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [aiPrompt, setAiPrompt] = useState(''); // For tracking the prompt input
	const [isGenerating, setIsGenerating] = useState(false); // Loading state
	const [error, setError] = useState(''); // Validation/Error state

	const isPromptValid = aiPrompt.trim().length > 10; // Min 10 characters
	const token = useAuth('Admin', (state) => state.token);

	useEffect(() => {
		const fetchSettings = async () => {
			const response = await formRequests.getSettings(token!);
			const { data } = response;

			if (!data.settings || !data.settings.ai.enabled) {
				return false;
			}

			setHasAISettings(true);
		};

		fetchSettings();
	}, []);

	const handleGenerateClick = async () => {
		if (!isPromptValid) {
			return; // Prevent invalid prompts
		}

		setError(''); // Reset error state
		setIsGenerating(true);

		try {
			// Example request to send prompt to AI API
			const response = await formRequests.generateForm(token!, { prompt: aiPrompt });

			setIsDialogOpen(false);
			setAiPrompt('');
			onGenerateSuccess(true);
		} catch (err) {
			setError('Error generating the form. Please try again later.');
		} finally {
			setIsGenerating(false); // End loading state
		}
	};

	if (!hasAISettings) {
		return <></>;
	}

	return (
		<>
			<Button startIcon={<MagicWand />} onClick={() => setIsDialogOpen(true)}>
				Generate Form
			</Button>
			<Dialog.Root open={isDialogOpen} onDismiss={() => setIsDialogOpen(false)}>
				<Dialog.Content>
					<Dialog.Header>Generate Form</Dialog.Header>
					<Dialog.Body>
						<Flex direction="column" gap={4} alignItems="flex-start" style={{ width: '100%' }}>
							<Typography>Describe the form you want to generate using plain text. The AI will help you!</Typography>
							<Field.Root style={{ width: '100%' }}>
								<Textarea
									name="aiPrompt"
									placeholder="e.g. 'Customer feedback form with name, email, and a text field for feedback'"
									onChange={(e: any) => setAiPrompt(e.target.value)}
									value={aiPrompt}
									error={aiPrompt && !isPromptValid ? 'Please enter more details.' : ''}
								/>
							</Field.Root>
							{error && (
								<Typography variant="pi" textColor="danger500">
									{error}
								</Typography>
							)}
						</Flex>
					</Dialog.Body>
					<Dialog.Footer>
						<Button
							startIcon={<MagicWand />}
							onClick={handleGenerateClick}
							loading={isGenerating}
							disabled={!isPromptValid || isGenerating}
						>
							Generate
						</Button>

						<Button variant="secondary" onClick={() => setIsDialogOpen(false)} disabled={isGenerating}>
							Cancel
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
};

export default GenerateForm;
