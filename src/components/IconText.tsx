import React from 'react'
import { Text, Box, Page, Icon } from 'zmp-ui'
import { IconTextProps } from '../models'

const IconText = ({
	icon,
	label,
	size,
	textSize,
	onClick = () => {},
	outClass = '',
	iconColor = 'text-slate',
	rightIcon = '',
	rightIconColor = '',
	rightIconSize = '',
}: IconTextProps) => {
	return (
		<div className={`flex flex-row items-center  overflow-hidden ${outClass}`} onClick={onClick}>
			{icon && (
				<Text className={iconColor}>
					<Icon icon={icon} size={size} />
				</Text>
			)}
			<Text className={`text-start ${textSize} ml-1  truncate block w-full`}>{label}</Text>
			{rightIcon && (
				<Text className={rightIconColor}>
					<Icon icon={rightIcon} size={rightIconSize} />
				</Text>
			)}
		</div>
	)
}
export default IconText
