import { Flex } from '@strapi/design-system';
import {
	Table,
	Rows,
	Columns,
	Trash2,
	Merge,
	SplitSquareVertical,
	Bold,
	Italic,
	Image as ImageIcon,
	Heading1,
	Heading2,
	Heading3,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Box,
	Minimize,
	Maximize,
} from 'lucide-react';
import TooltipIconButton from '../TooltipIconButton';

const TableControls = ({ editor, setMediaOpen }: { editor: any; setMediaOpen: (open: boolean) => void }) => {
	if (!editor) return null;

	const isInTable = editor.isActive('table');

	const isImageSelected = (editor: any) => {
		const { state } = editor.view;
		const node = state.selection?.node;
		return node?.type?.name.includes('image');
	};

	const insertTable = () => {
		editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
	};

	const resizeSelectedImage = (editor: any, width: number) => {
		const { state, dispatch } = editor.view;
		const { selection } = state;
		const node = selection.node;

		if (node && node.type.name === 'imageComponent') {
			const tr = state.tr.setNodeMarkup(selection.from, undefined, {
				...node.attrs,
				width: `${width}px`,
				style: `width: ${width}px;`,
			});

			dispatch(tr);
		}
	};

	return (
		<Flex gap={1} paddingBottom={3} wrap="wrap" justifyContent="flex-start" alignItems="center">
			{/* Format Controls */}
			<TooltipIconButton
				label="Bold"
				onClick={() => editor.chain().focus().toggleBold().run()}
				variant="tertiary"
				disabled={false}
				width="auto"
			>
				<Bold size={16} />
			</TooltipIconButton>
			<TooltipIconButton
				label="Italic"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				variant="tertiary"
				disabled={false}
				width="auto"
			>
				<Italic size={16} />
			</TooltipIconButton>
			<TooltipIconButton
				label="H1"
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				variant="tertiary"
				disabled={false}
				width="auto"
			>
				<Heading1 size={16} />
			</TooltipIconButton>
			<TooltipIconButton
				label="H2"
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				variant="tertiary"
				disabled={false}
				width="auto"
			>
				<Heading2 size={16} />
			</TooltipIconButton>
			<TooltipIconButton
				label="H3"
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				variant="tertiary"
				disabled={false}
				width="auto"
			>
				<Heading3 size={16} />
			</TooltipIconButton>
			<Box style={{ width: '1px', height: '24px', backgroundColor: '#E4E4E7', margin: '0 8px' }} />
			<TooltipIconButton
				label="Align left"
				onClick={() => editor.chain().focus().setTextAlign('left').run()}
				variant="tertiary"
				disabled={false}
				width="auto"
			>
				<AlignLeft size={16} />
			</TooltipIconButton>
			<TooltipIconButton
				label="Align center"
				onClick={() => editor.chain().focus().setTextAlign('center').run()}
				variant="tertiary"
				disabled={false}
				width="auto"
			>
				<AlignCenter size={16} />
			</TooltipIconButton>
			<TooltipIconButton
				label="Align right"
				onClick={() => editor.chain().focus().setTextAlign('right').run()}
				variant="tertiary"
				disabled={false}
				width="auto"
			>
				<AlignRight size={16} />
			</TooltipIconButton>
			<Box style={{ width: '1px', height: '24px', backgroundColor: '#E4E4E7', margin: '0 8px' }} />
			<TooltipIconButton
				label="Insert Image"
				onClick={() => setMediaOpen(true)}
				variant="tertiary"
				disabled={isImageSelected(editor)}
				width="auto"
			>
				<ImageIcon size={16} />
			</TooltipIconButton>
			{isImageSelected(editor) && (
				<>
					<TooltipIconButton
						label="Resize Image Small"
						onClick={() => resizeSelectedImage(editor, 150)}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<Minimize size={16} />
					</TooltipIconButton>
					<TooltipIconButton
						label="Resize Image Large"
						onClick={() => resizeSelectedImage(editor, 300)}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<Maximize size={16} />
					</TooltipIconButton>
					<TooltipIconButton
						label="Align left"
						onClick={() => editor.chain().focus().setTextAlign('left').run()}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<AlignLeft size={16} />
					</TooltipIconButton>
					<TooltipIconButton
						label="Align center"
						onClick={() => editor.chain().focus().setTextAlign('center').run()}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<AlignCenter size={16} />
					</TooltipIconButton>
					<TooltipIconButton
						label="Align right"
						onClick={() => editor.chain().focus().setTextAlign('right').run()}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<AlignRight size={16} />
					</TooltipIconButton>
					<TooltipIconButton
						label="Delete image"
						onClick={() => editor.chain().focus().deleteImage().run()}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<Trash2 size={16} />
					</TooltipIconButton>
				</>
			)}
			<Box style={{ width: '1px', height: '24px', backgroundColor: '#E4E4E7', margin: '0 8px' }} />

			<TooltipIconButton label="Insert table" onClick={insertTable} variant="tertiary" disabled={isInTable} width="auto">
				<Table size={16} />
			</TooltipIconButton>
			{isInTable && (
				<>
					<TooltipIconButton
						label="Add row above"
						onClick={() => editor.chain().focus().addRowBefore().run()}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<Rows size={16} />
					</TooltipIconButton>
					<TooltipIconButton
						label="Add row below"
						onClick={() => editor.chain().focus().addRowAfter().run()}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<Rows size={16} />
					</TooltipIconButton>
					<TooltipIconButton
						label="Add column before"
						onClick={() => editor.chain().focus().addColumnBefore().run()}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<Columns size={16} />
					</TooltipIconButton>
					<TooltipIconButton
						label="Add column after"
						onClick={() => editor.chain().focus().addColumnAfter().run()}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<Columns size={16} />
					</TooltipIconButton>
					<TooltipIconButton
						label="Merge cells"
						onClick={() => editor.chain().focus().mergeCells().run()}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<Merge size={16} />
					</TooltipIconButton>
					<TooltipIconButton
						label="Split cell"
						onClick={() => editor.chain().focus().splitCell().run()}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<SplitSquareVertical size={16} />
					</TooltipIconButton>
					<TooltipIconButton
						label="Delete table"
						onClick={() => editor.chain().focus().deleteTable().run()}
						variant="tertiary"
						disabled={false}
						width="auto"
					>
						<Trash2 size={16} />
					</TooltipIconButton>
				</>
			)}
		</Flex>
	);
};

export default TableControls;
