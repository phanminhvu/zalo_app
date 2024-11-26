import React from 'react'
import { HiOutlineArrowRight, HiShoppingCart } from 'react-icons/hi'
import { Text } from 'zmp-ui'
const ArrowObject = ({
	icon = null,
	title,
	content,
	subcontent,
	rightcontent = null,
	onClick = () => {},
	padding = 4,
	iconmar = 0,
	bg = 'bg-white',
	textSize = 'xSmall',
	contentTextSize = 'xSmall',
	contentTextColor = '',
	extraClassName = '',
}) => {
	return (
		<div className={`flex ${bg} p-${padding} ${extraClassName}`} onClick={onClick}>
			{icon && icon}
			<div className={`flex-1 pl-${iconmar}`}>
				<Text size={textSize} bold>
					{title}
				</Text>
				<Text size={contentTextSize} className={contentTextColor}>
					{content}
				</Text>
				<p
					dangerouslySetInnerHTML={{
						__html: subcontent,
					}}
				/>
			</div>
			{rightcontent && (
				<div style={{ maxWidth: '120px' }}>
					<Text size='xSmall'>{rightcontent}</Text>
				</div>
			)}
			<HiOutlineArrowRight className='ml-2 h-4 w-4 ' />
		</div>
	)
}

export default ArrowObject
