import React, { useEffect } from 'react'
import { Box, useNavigate, Text, Checkbox, Icon } from 'zmp-ui'
import { Button } from 'flowbite-react'
import { HiOutlineShoppingBag, HiOutlineHome } from 'react-icons/hi'
const EmptyBox = ({ title, content }) => {
	return (
		<Box mt={1} className={'bg-primary p-4'}>
			<Text size={'large'} className={'text-center text-white font-bold'}>
				{title}
			</Text>
			<Text size={'xSmall'} className={'text-center text-white'}>
				{content}
			</Text>
			<Button.Group className={`flex w-full  bottom-0 mt-4`}>
				<Button className={`flex-1 border-l-0 border-b-0 rounded-none bg-pink-900`} onClick={() => {}}>
					<HiOutlineHome className='mr-2 h-5 w-5' />
					<p>Trang chủ</p>
				</Button>
			</Button.Group>
		</Box>
	)
}
export default EmptyBox
