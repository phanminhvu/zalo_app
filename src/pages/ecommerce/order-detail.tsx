import React, { useEffect } from 'react'
import useSetHeader from '../../hooks/useSetHeader'
import { Order } from '../../models'
import { useLocation } from 'react-router-dom'
import EmptyBox from '../../components/empty'
import { Box, Button, Header, Page, Text, useNavigate } from 'zmp-ui'
import { convertPrice } from '../../utils'
import { openChat } from 'zmp-sdk'
import { ZALO_OA_ID } from '../../utils/constants'

const OrderDetail = () => {
	const setHeader = useSetHeader()
	const { state } = useLocation()
	const navigate = useNavigate()
	const order: Order = state?.order
	const orderId = order?.id?.split('_')?.[1]
	const orderShipType = order?.branch_type

	useEffect(() => {
		setHeader({
			customTitle: 'Chi tiết đơn hàng',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
			onLeftClick: () => navigate(-1),
		})
	}, [])

	console.log(order, 'alo')

	return (
		<Page className='bg-gray-200 overflow-auto pb-20'>
			<Box className='rounded-lg bg-white m-4 overflow-hidden'>
				<Text className='text-xl text-white bggreen p-3'>{'Đơn hàng đã tạo'}</Text>
				<Box className='p-3'>
					<Box>
						<Text className='text-lg font-medium'>{`Mã đơn hàng: ${orderId}`}</Text>
						<Text className='text-sm text-gray-600'>{`Ngày tạo: ${order.date_created}`}</Text>
					</Box>
					<div className='h-px bg-gray-100 mt-2 mb-2' />
					{/* 
                    0: Giao tận nơi 
                    1: Lay tai cua hang
                */}
					{orderShipType === 0 ? (
						<Box>
							<Text className='font-medium text-lg'>{'Giao hàng tận nơi'}</Text>
							<Text className='font-regular'>
								{`${order.shipping?.name ?? '#'}`}
								<span className='text-sm text-gray-500 ml-2'>{order.shipping?.phone ?? ''}</span>
							</Text>
							<Text className='text-sm text-gray-600'>{`${order.shipping?.address ?? '#'}`}</Text>
							<Text className='text-sm text-gray-600'>{`Thời gian giao hàng: ${order.shippingDate?.hour}:${order.shippingDate?.minute} ngày : ${order.shippingDate?.date} `}</Text>
						</Box>
					) : (
						<Box>
							<Text className='font-medium text-lg'>{'Lấy tại cửa hàng'}</Text>
							<Text className='font-regular'>{order.cua_hang?.[0]?.name}</Text>
							<Text className='text-sm text-gray-600'>{order.cua_hang?.[0]?.address}</Text>
							<Text className='text-sm text-gray-600'>{`Thời gian giao hàng: ${order.shippingDate?.hour}:${order.shippingDate?.minute} ngày : ${order.shippingDate?.date} `}</Text>
						</Box>
					)}
				</Box>
			</Box>
			<Box className='rounded-lg bg-white m-4 overflow-hidden p-3'>
				<Text className='text-xl font-medium'>{order.cua_hang?.[0]?.name}</Text>
				{order.line_items?.map((item) => {
					return (
						<Box className='flex flex-row mt-3 mb-3'>
							<img className='h-16 w-16 mr-4' src={`${item?.image}`} alt={`${item.name}`} />
							<Box className='mt-1 flex-1'>
								<Box className='flex flex-row justify-between'>
									<Text className='font-medium'>{`${item.name}`}</Text>
									<Text className='text-gray-400'>{`x${item.quantity}`}</Text>
								</Box>
								<Text className='flex-1 text-end mt-2'>{`${convertPrice(item.subtotal)} đ`}</Text>
							</Box>
						</Box>
					)
				})}
				<div className='h-px bg-gray-100 mt-2 mb-2' />
				<Box>
					<Box className='flex flex-row justify-between'>
						<Text className='text-sm text-gray-600'>{`Tổng tiền hàng:`}</Text>
						<Text className='text-sm text-gray-600'>{`${convertPrice(order.total_item)} đ`}</Text>
					</Box>
					<Box className='flex flex-row justify-between mt-1'>
						<Text className='text-sm text-gray-600'>{`Phí vận chuyển:`}</Text>
						<Text className='text-sm text-gray-600'>{`${convertPrice(order.shipping_total)} đ`}</Text>
					</Box>
				</Box>
				<div className='h-px bg-gray-100 mt-2 mb-2' />
				<Box className='mt-3'>
					<Text className='text-end'>
						{`Thành tiền (${order.payment_method}): `}
						<span className='font-semibold'>{convertPrice(order.total)} đ</span>
					</Text>
				</Box>
			</Box>
			<Box className='rounded-lg bg-white m-4 overflow-hidden p-3'>
				<Text className='font-medium'>{`Bạn cần hỗ trợ?`}</Text>
				<Button
					className='mt-4'
					size='medium'
					fullWidth
					variant='secondary'
					onClick={() => {
						openChat({
							type: 'oa',
							id: ZALO_OA_ID,
							message: `Hỗ trợ/ khiếu nại về đơn hàng ${orderId}`,
							success: () => {},
							fail: (err) => {},
						})
					}}>
					{'Hỗ trợ/khiếu nại về đơn hàng'}
				</Button>
			</Box>
			{!order && <EmptyBox title={`#`} content={`Vui lòng thử lại`} />}
		</Page>
	)
}
export default OrderDetail
