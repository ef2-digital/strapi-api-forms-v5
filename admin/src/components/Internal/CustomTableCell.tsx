import TableCell from '@tiptap/extension-table-cell';

const CustomTableCell = TableCell.extend({
	parseHTML() {
		return [
			{
				tag: 'td',
			},
		];
	},

	addAttributes() {
		return {
			...this.parent?.(),
			style: {
				default: null,
				parseHTML: (element) => element.getAttribute('style'),
				renderHTML: (attributes) => {
					return attributes.style ? { style: attributes.style } : {};
				},
			},
			contenteditable: {
				default: 'true',
				parseHTML: (element) => element.getAttribute('contenteditable') || 'true',
				renderHTML: (attrs) => {
					return {
						contenteditable: attrs.contenteditable,
					};
				},
			},
		};
	},
});

export default CustomTableCell;
