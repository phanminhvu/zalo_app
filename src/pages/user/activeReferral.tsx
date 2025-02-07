import React, { useEffect, useState } from 'react'
import useSetHeader from '../../hooks/useSetHeader'
import { Box, Button, Modal, Page, useNavigate } from 'zmp-ui'
import { getSetting, showToast, getUserID, getAccessToken } from 'zmp-sdk'
import { useParams } from 'react-router-dom'
import { authorizeV2, getPhoneNumberUser } from '../../services/zalo'
import { sleep } from '../../dummy/utils'

const ActiveReferral = () => {
	const setHeader = useSetHeader()
	const navigate = useNavigate()
	let { code } = useParams()
	const [popupVisible, setPopupVisible] = useState(false)

	useEffect(() => {
		setHeader({
			customTitle: 'Giới thiệu tài khoản',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
			onLeftClick: () => navigate('/'),
		})

		getSetting().then((value) => {
			if (!value.authSetting?.['scope.userPhonenumber']) {
				// authorizeV2()
				setPopupVisible(true)
			}
		})
	}, [])

	const createZaloCustomer = async () => {
		showToast({ message: 'Đang kích hoạt tài khoản...' })
		const accessToken = await getAccessToken()
		console.log(JSON.stringify({ accessToken , isReferral : true }), 'alooo')
		fetch('https://quequan.vn:8081/customer/zalocustomer', {
			method: 'POST',
			body: JSON.stringify({ accessToken , isReferral : true }),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((value) => {
				console.log('post user info success', value)
				activeReferralCode()
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const activeReferralCode = async () => {
		await sleep(200)
		const id = await getUserID()
		fetch('https://quequan.vn:8081/customer/active-zalo-referral-code', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, code }),
		})
			.then((response) => {
				return response.json()
			})
			.then((result) => {
				if (result.message) showToast({ message: result.message })
			})
			.catch((error) => {
				console.log('JSON.stringify(error)', JSON.stringify(error))
				showToast({ message: 'Đã có lỗi xảy ra!' })
			})
	}
	// https://zalo.me/s/3330579448132307150/?action=active-referral&code=84967538033
	const getPhoneNumber = async () => {
		await authorizeV2()
		const setting = await getSetting()
		if (setting.authSetting['scope.userPhonenumber']) {
			getPhoneNumberUser()
		}
	}

	return (
		<Page className='bg-gray-200'>
			<Modal
				visible={popupVisible}
				title='Yêu cầu cấp quyền'
				onClose={() => {
					setPopupVisible(false)
				}}
				verticalActions
				description='Cho phép chúng tôi truy cập số điện thoại để tăng cường trải nghiệm và thuận tiện cho công việc đặt hàng và giao hàng!'>
				<Box p={6}>
					<Button
						onClick={() => {
							setPopupVisible(false)
							getPhoneNumber()
						}}
						fullWidth>
						Xác nhận
					</Button>
				</Box>
			</Modal>
			<div className='bg-white flex flex-col m-4 p-3 gap-5 rounded-lg'>
				<span className='text-base font-semibold text-blue-600'>{'Thông tin người giới thiệu'}</span>
				<div className='flex flex-col bg-gray-100 p-3 rounded-lg gap-2'>
					<div className='flex justify-between items-center h-6'>
						<span className='text-sm font-medium'>{'Mã giới thiệu'}</span>
						<span className='text-base font-extrabold text-green-500'>{code}</span>
					</div>
				</div>
				<div className='flex flex-col gap-2'>
					<Button size='medium' onClick={createZaloCustomer}>
						{'Kích hoạt tài khoản'}
					</Button>
					<Button size='medium' variant='secondary' onClick={() => navigate('/')}>
						{'Trở về trang chủ'}
					</Button>
				</div>
			</div>
		</Page>
	)
}
// 
export default ActiveReferral

