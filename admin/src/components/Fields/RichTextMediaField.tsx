import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import HardBreak from '@tiptap/extension-hard-break';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { MediaLib } from '../Internal/MediaLibrary';
import { Box } from '@strapi/design-system';
import styled from 'styled-components';
import TableControls from '../RichText/TableControls';
import TextAlign from '@tiptap/extension-text-align';
import { ResizableImage } from 'tiptap-extension-resizable-image';

interface Block {
	field?: {
		name: string;
		label: string;
		type: string;
	};
	i: string;
}

interface RichTextWithMediaProps {
	value: string;
	onChange: (value: string) => void;
	availableFields?: Block[];
	height?: number;
}

const StyledEditor = styled.div`
	*:focus-visible {
		outline: none;
	}

	.tiptap {
		.node-imageComponent {
			position: relative;
			display: inline-block;
		}
		.node-imageComponent.ProseMirror-selectednode {
			z-index: 1;
		}
		.node-imageComponent + img.ProseMirror-separator {
			width: 1px !important;
		}
		.image-component {
			position: relative;
			user-select: auto;
			display: inline-flex;
		}
		.image-component img {
			margin-bottom: 0;
		}
		.image-component img[data-keep-ratio]:not([data-keep-ratio='false']) {
			object-fit: contain;
		}
		.image-component img[data-keep-ratio='false'] {
			object-fit: fill;
		}
		.image-component > .caption {
			z-index: 1;
			cursor: text;
			outline: none;
			padding: 5px;
			color: #fff;
			background: rgba(0, 0, 0, 0.5);
			position: absolute;
			inset: auto 0 0;
			margin: auto;
			white-space: pre-wrap;
			word-break: break-word;
			min-height: 35px;
			max-height: 100%;
			overflow-y: auto;
			font-size: initial;
			font-weight: initial;
		}
		.image-component > .caption:before {
			position: absolute;
		}
		.image-component > .caption:empty:before {
			content: var(--caption-placeholder, 'Enter a caption...');
		}
		.image-component {
			--box-color: rgb(60, 132, 244);
		}
		.node-imageComponent.ProseMirror-selectednode .image-resizer {
			display: block;
		}
		.node-imageComponent.ProseMirror-selectednode .image-component {
			outline: 2px solid var(--box-color);
		}
		.image-component .image-resizer {
			--box-size: 14px;
			--resizer-offset: calc(var(--box-size) / 2 + 1px);
			z-index: 2;
			display: none;
			width: var(--box-size);
			height: var(--box-size);
			position: absolute;
			background-color: var(--box-color);
			border: 2px solid #fff;
			border-radius: 50%;
		}
		.image-component .image-resizer.image-resizer-n {
			inset: calc(var(--resizer-offset) * -1) 0 auto;
			margin: auto;
			cursor: n-resize;
		}
		.image-component .image-resizer.image-resizer-ne {
			top: calc(var(--resizer-offset) * -1);
			right: calc(var(--resizer-offset) * -1);
			cursor: ne-resize;
		}
		.image-component .image-resizer.image-resizer-e {
			right: calc(var(--resizer-offset) * -1);
			top: 0;
			bottom: 0;
			margin: auto;
			cursor: e-resize;
		}
		.image-component .image-resizer.image-resizer-se {
			bottom: calc(var(--resizer-offset) * -1);
			right: calc(var(--resizer-offset) * -1);
			cursor: nwse-resize;
		}
		.image-component .image-resizer.image-resizer-s {
			inset: auto 0 calc(var(--resizer-offset) * -1);
			margin: auto;
			cursor: s-resize;
		}
		.image-component .image-resizer.image-resizer-sw {
			bottom: calc(var(--resizer-offset) * -1);
			left: calc(var(--resizer-offset) * -1);
			cursor: sw-resize;
		}
		.image-component .image-resizer.image-resizer-w {
			left: calc(var(--resizer-offset) * -1);
			top: 0;
			bottom: 0;
			margin: auto;
			cursor: w-resize;
		}
		.image-component .image-resizer.image-resizer-nw {
			top: calc(var(--resizer-offset) * -1);
			left: calc(var(--resizer-offset) * -1);
			cursor: nw-resize;
		}

		.image-resizer-n,
		.image-resizer-e,
		.image-resizer-s,
		.image-resizer-w {
			visibility: hidden;
		}

		min-height: 100px;
		p {
			font-size: 1.25rem;
		}
		table {
			width: 100%;
			border-collapse: collapse;
			margin-top: 1rem;
		}

		td,
		th {
			border: 1px solid #ccc;
			padding: 8px;
			text-align: left;
		}
		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			font-weight: bold;
			line-height: 1.1;
			margin-top: 2rem;
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
		img {
			max-width: 100%;
			height: auto;
			display: block;
			margin-top: 1rem;
		}
	}
`;

const RichTextMediaField: React.FC<RichTextWithMediaProps> = ({ value, onChange, height = 200 }) => {
	const [mediaOpen, setMediaOpen] = useState(false);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Paragraph,
			HardBreak,
			Heading.configure({ levels: [1, 2, 3] }),
			Bold,
			Italic,
			Placeholder.configure({ placeholder: 'Start typing...' }),
			Table.configure({ resizable: true }),
			TableRow,
			TableHeader,
			TableCell,
			TextAlign.configure({
				types: ['heading', 'paragraph'], // or 'all' if needed
			}),
			ResizableImage,
		],
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		immediatelyRender: false,
		content: value,
	});

	const handleSelectMedia = (files: any) => {
		const img = files.find((file: any) => file.mime.includes('image'));

		if (img && img.url) {
			editor?.commands.setResizableImage({
				src: img.url,
				alt: img.alt,
				title: img.title,
				width: img.width,
				height: img.height,
				className: '',
				'data-keep-ratio': true,
			});
		}

		setMediaOpen(false);
	};

	if (!editor) return <p>Loading editor…</p>;

	return (
		<Box padding={4} background="neutral100" borderRadius="4px">
			<TableControls editor={editor} setMediaOpen={setMediaOpen} />

			<StyledEditor>
				<Box background="neutral0" border="1px solid #EAEAEA" borderRadius="4px" padding={3} minHeight={height} className="tiptap">
					<EditorContent editor={editor} className="editor" />
				</Box>
			</StyledEditor>
			<MediaLib isOpen={mediaOpen} toggle={() => setMediaOpen(false)} handleChangeAssets={handleSelectMedia} />
		</Box>
	);
};

export default RichTextMediaField;
