import React from 'react'
import { Avatar, Text, Box, Page } from 'zmp-ui'
import { IconMenuProps } from '../models'

const IconMenu = ({
	image,
	label,
	imageSize,
	textSize,
	onClick = () => {},
	imageType = 'image',
	outClass = '',
}: IconMenuProps) => {
	return (
		<div className={` flex flex-col items-center  overflow-hidden`} onClick={onClick}>
			{imageType.localeCompare('avarta') === 0 && (
				<Avatar src={image} size={imageSize} className={`p-2 ${outClass}`}></Avatar>
			)}
			{imageType.localeCompare('image') === 0 && (
				<div className={`${outClass}`}>
					<img src={image} style={{ width: imageSize, height: imageSize }} />
				</div>
			)}
			<Text className={`text-center ${textSize} mt-1    line-clamp-v2 w-full`}>{label}</Text>
		</div>
	)
}
export default IconMenu
