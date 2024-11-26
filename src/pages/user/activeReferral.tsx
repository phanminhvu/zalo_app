import React, { useEffect, useState } from 'react'
import useSetHeader from '../../hooks/useSetHeader'
import { useRecoilValue } from 'recoil'
import { authState } from '../../states/auth'
import { Button, Page, useNavigate } from 'zmp-ui'
import { openShareSheet } from 'zmp-sdk'
import { useLocation, useParams } from 'react-router-dom'

const ActiveReferral = () => {
	const setHeader = useSetHeader()
	const navigate = useNavigate()
	const authDt = useRecoilValue(authState)
	let { code } = useParams()

	console.log(code)

	useEffect(() => {
		setHeader({
			customTitle: 'Giới thiệu tài khoản',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
      onLeftClick: () => navigate('/home')
		})
	}, [])

	const activeReferralCode = () => {}

	return (
		<Page className='bg-gray-200'>
			<div className='bg-white flex flex-col m-4 p-3 gap-5 rounded-lg'>
				<span className='text-base font-semibold text-blue-600'>{'Thông tin người giới thiệu'}</span>
				<div className='flex flex-col bg-gray-100 p-3 rounded-lg gap-2'>
					<div className='flex justify-between items-center h-6'>
						<span className='text-sm font-medium'>{'Mã giới thiệu'}</span>
						<span className='text-base font-extrabold text-green-500'>{code}</span>
					</div>
				</div>
				<div className='flex flex-col gap-2'>
					<Button size='medium' onClick={activeReferralCode}>
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
export default ActiveReferral

