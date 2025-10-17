import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import HardBreak from '@tiptap/extension-hard-break'; // Enables "Enter" to create paragraphs
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';

import { Box, Button, Flex } from '@strapi/design-system';
import { Bold as BoldIcon, Italic as ItalicIcon } from '@strapi/icons';
import styled from 'styled-components';
import { Block } from '../../context/FormContext';

interface RichTextFieldProps {
	value: string;
	onChange: (value: string) => void;
	availableFields: Block[];
	height?: number;
}

// Styled Component for TipTap Editor Styles
const StyledEditor = styled.div`
	.tiptap {
		min-height: 100px;
		p {
			font-size: 1.25rem;
		}
		:first-child {
			margin-top: 0;
		}

		/* Heading styles */
		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			font-weight: bold;
			line-height: 1.1;
			margin-top: 2.5rem;
			text-wrap: pretty;
		}

		h1 {
			font-size: 2rem;
		}
		h2 {
			font-size: 1.8rem;
		}
		h3 {
			font-size: 1.6rem;
		}
		h4,
		h5,
		h6 {
			font-size: 1.5rem;
		}

		table {
			border-collapse: collapse;
			table-layout: fixed;
			width: 100%;
			margin: 0;
			overflow: hidden;

			td {
				min-width: 10em;
				border: 2px solid #ced4da;
				padding: 3px 5px;
				vertical-align: top;
				box-sizing: border-box;
				position: relative;

				> * {
					margin-bottom: 0;
				}
			}

			.selectedCell:after {
				z-index: 2;
				position: absolute;
				content: '';
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				background: rgba(200, 200, 255, 0.4);
				pointer-events: none;
			}

			.column-resize-handle {
				position: absolute;
				right: -2px;
				top: 0;
				bottom: -2px;
				width: 4px;
				background-color: #adf;
				pointer-events: none;
			}

			p {
				margin: 0;
			}
		}
	}
`;

const RichTextField: React.FC<RichTextFieldProps> = ({ value, onChange, availableFields, height = 100 }) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Paragraph,
			HardBreak,
			Heading.configure({ levels: [1, 2, 3] }),
			Bold,
			Italic,
			Placeholder.configure({ placeholder: 'Start typing...' }),
			Table.configure({
				resizable: true,
			}),
			TableRow,
			TableHeader,
			TableCell,
		],
		content: value.replaceAll(',', ''),
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) {
		return <p>Loading editor...</p>;
	}

	// Insert field placeholders
	const insertPlaceholder = (field: string) => {
		editor.commands.insertContent(`{{${field}}}`);
	};

	return (
		<Box padding={4} background="neutral100" borderRadius="4px">
			{/* Toolbar */}
			<Flex gap={2} paddingBottom={3} wrap="wrap">
				<Button variant="tertiary" onClick={() => editor.chain().focus().toggleBold().run()} startIcon={<BoldIcon />}>
					Bold
				</Button>
				<Button variant="tertiary" onClick={() => editor.chain().focus().toggleItalic().run()} startIcon={<ItalicIcon />}>
					Italic
				</Button>
				<Button variant="tertiary" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
					H1
				</Button>
				<Button variant="tertiary" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
					H2
				</Button>
				<Button variant="tertiary" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
					H3
				</Button>
			</Flex>

			{availableFields && availableFields.length > 0 && (
				<Flex gap={2} paddingBottom={3} wrap="wrap">
					{availableFields.map((field: Block) => {
						if (!field.field || field.field.type === 'file') {
							return <></>;
						}

						return (
							<Button key={field.i} variant="secondary" onClick={() => field.field && insertPlaceholder(field.field?.name)}>
								{field.field?.label}
							</Button>
						);
					})}
				</Flex>
			)}

			{/* Rich Text Editor */}
			<StyledEditor>
				<Box background="neutral0" border="1px solid #EAEAEA" borderRadius="4px" padding={3} minHeight={height ? `${height}px` : '100px'}>
					{/* Editor Content */}
					<EditorContent editor={editor} />
				</Box>
			</StyledEditor>
		</Box>
	);
};

export default RichTextField;
