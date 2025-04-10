import * as Tooltip from '@radix-ui/react-tooltip';
import { Typography, Box, IconButton } from '@strapi/design-system';

interface TooltipIconButtonProps {
	children: React.ReactNode;
	label: string | undefined;
	variant: string;
	onClick?: () => void;
	disabled: boolean;
	showBorder?: boolean;
	className?: string;
	width?: string;
}

const TooltipIconButton = ({
	children,
	label,
	variant,
	onClick,
	disabled,
	className,
	showBorder = false,
	width = '100%',
}: TooltipIconButtonProps) => {
	if (!label)
		return (
			<IconButton className={className} variant={variant} onClick={onClick} disabled={disabled} withTooltip={false}>
				{children}
			</IconButton>
		);

	const tooltipContent = showBorder ? (
		<Box padding={4} margin={2} background="neutral0" hasRadius shadow="filterShadow" className={className} style={{ width }}>
			<Typography style={{ fontSize: '10px' }}>{label}</Typography>
			<Tooltip.Arrow />
		</Box>
	) : (
		<>
			<Typography style={{ fontSize: '10px' }}>{label}</Typography>
			<Tooltip.Arrow />
		</>
	);

	return (
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<IconButton
						type="button"
						variant={variant}
						onClick={onClick}
						disabled={disabled}
						withTooltip={false}
						className={className}
						style={{ width }}
						justifyContent="flex-start"
					>
						{children}
					</IconButton>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						style={{
							background: '#000',
							color: '#fff',
							padding: '4px',
							fontSize: '10px',
							borderRadius: '4px',
						}}
						sideOffset={5}
					>
						{tooltipContent}
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
};

export default TooltipIconButton;
