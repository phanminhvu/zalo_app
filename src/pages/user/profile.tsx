import React, { useEffect, useState } from 'react'
import { Box, Icon, List, useNavigate } from 'zmp-ui'
import Container from '../../components/layout/Container'
import { HiOutlineFlag, HiOutlineShoppingCart, HiOutlineUser } from 'react-icons/hi'
import { useRecoilState, useRecoilValue } from 'recoil'
import { authState } from '../../states/auth'
import useSetHeader from '../../hooks/useSetHeader'
import { showOAWidget } from 'zmp-sdk/apis'
import { getPhoneNumberUser } from '../../services/zalo'
import { isFromSettingState, isMappingState } from '../../state'
import { createShortcut } from 'zmp-sdk/apis'
import { openWebview } from 'zmp-sdk/apis'
const openUrlInWebview = async () => {
	try {
		await openWebview({
			url: 'https://zalo.me/0963559840',
			config: {
				style: 'bottomSheet',
				leftButton: 'back',
			},
		})
	} catch (error) {
		// xử lý khi gọi api thất bại
		console.log(error)
	}
}

const createMiniAppShortcut = async () => {
	try {
		await createShortcut({
			params: {
				utm_source: 'shortcut',
			},
		})
	} catch (error) {
		// xử lý khi gọi api thất bại
		console.log(error)
	}
}

const { Item } = List
const UserProfile = () => {
	const navigate = useNavigate()
	const authDt = useRecoilValue(authState)
	const setHeader = useSetHeader()
	const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
	const [isMapping, setIsMapping] = useRecoilState<boolean>(isFromSettingState)
	useEffect(() => {
		setHeader({
			customTitle: 'Trang cá nhân',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
		})
		showOAWidget({
			id: 'oaWidget',
			guidingText: 'Nhận thông báo khuyến mãi mới nhất từ cửa hàng',
			color: '#0068FF',
			onStatusChange: (status) => {
				console.log(status)
			},
		})
		// const savedPhoneNumber = sessionStorage.getItem("phoneNumber");
		//         if (savedPhoneNumber) {
		//             setPhoneNumber(savedPhoneNumber);
		//         }else{
		//             getPhoneNumberUser();
		//         }
	}, [])
	return (
		<Container className={'  zui-container-background-color'}>
			<Box m={4} p={0} className={'rounded-lg bg-white'}>
				<List>
					<Item
						title='Thông tin tài khoản'
						prefix={<HiOutlineUser size={20} />}
						className={'text-sm m-0'}
						suffix={<Icon icon='zi-chevron-right' />}
						onClick={() => {
							setIsMapping(true)
							navigate('/user-info')
						}}
					/>
					<Item
						title='Địa chỉ đã lưu'
						prefix={<HiOutlineFlag size={20} />}
						suffix={<Icon icon='zi-chevron-right' />}
						className={'text-sm m-0'}
						onClick={() => {
							setIsMapping(true)
							navigate('/my-addresses/profile')
						}}
					/>
					<Item
						title='Lịch sử đơn hàng'
						prefix={<HiOutlineShoppingCart size={20} />}
						suffix={<Icon icon='zi-chevron-right' />}
						className={'text-sm m-0'}
						onClick={() => {
							setIsMapping(true)
							navigate('/my-orders')
						}}
					/>
				</List>
			</Box>
			<Box m={4} p={0} className={'rounded-lg bg-white'}>
				<List>
					<Item
						title='Chính sách riêng tư'
						className={'text-sm m-0'}
						suffix={<Icon icon='zi-chevron-right' />}
						onClick={() => {
							setIsMapping(true)
							navigate('/detail-new/3')
						}}
					/>
					<Item
						title='Điều khoản dịch vụ'
						suffix={<Icon icon='zi-chevron-right' />}
						className={'text-sm m-0'}
						onClick={() => {
							setIsMapping(true)
							navigate('/detail-new/4')
						}}
					/>
					<Item
						title='Hướng dẫn sử dụng'
						suffix={<Icon icon='zi-chevron-right' />}
						className={'text-sm m-0'}
						onClick={() => {
							setIsMapping(true)
							navigate('/detail-new/1')
						}}
					/>
					<Item
						title='Thêm Quế Quân vào màn hình chính'
						suffix={<Icon icon='zi-share-external-1' />}
						className={'text-sm m-0'}
						onClick={() => {
							createMiniAppShortcut()
						}}
					/>
				</List>
			</Box>
			<Box m={4} p={0} className='rounded-lg bg-white'>
				<div id='oaWidget' />
			</Box>
			<Box m={4} p={0} className='rounded-lg bg-white'>
				<List>
					<Item
						title='Liên hệ với nhà phát triển ứng dụng'
						suffix={<Icon icon='zi-chat' />}
						className={'text-sm m-0'}
						onClick={() => {
							openUrlInWebview()
						}}
					/>
				</List>
			</Box>
		</Container>
	)
}
export default UserProfile
