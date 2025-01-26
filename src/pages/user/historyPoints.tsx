import React, { useEffect, useState } from 'react'
import useSetHeader from '../../hooks/useSetHeader'
import { useRecoilValue } from 'recoil'
import { authState } from '../../states/auth'
import { Box, Page, Spinner, Text, useNavigate } from 'zmp-ui'
import { HistoryPoint } from '../../models'
import { convertPrice } from '../../utils'
import { showToast } from 'zmp-sdk'

const HistoryPoints = () => {
	const setHeader = useSetHeader()
	const navigate = useNavigate()
	const authDt = useRecoilValue(authState)
	const [data, setData] = useState<HistoryPoint[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [point, setPoint] = useState(0)

	useEffect(() => {
		getData()
	}, [])

	const getData = async () => {
		console.log(authDt.profile.id)
		setIsLoading(true)
		fetch(`https://quequan.vn:8081/customer/get-history-points?userid=${authDt.profile.id}`)
			.then((response) => {
				return response.json()
			})
			.then((result) => {
				console.log(result)
				if (result.data) setData(result.data)
				setIsLoading(false)
			})
			.catch((error) => {
				console.log(JSON.stringify(error))
				setIsLoading(false)
			})

		fetch(`https://quequan.vn:8081/customer/zalo-customer-point?userid=${authDt?.profile?.id}`)
			.then((response) => {
				return response.json()
			})
			.then((result) => {
				console.log(result, 'alosss')
				if (result?.point) setPoint(result?.point)
			})
			.catch((error) => {
				console.log(JSON.stringify(error))
				showToast({ message: error?.message })
			})
	}

	useEffect(() => {
		setHeader({
			customTitle: 'Tích điểm/Tiêu điểm',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
		})
	}, [])

	const showOrder = (order: HistoryPoint) => {
		const id = order?.idOrder

		fetch(`https://quequan.vn:8081/customer/order-detail?orderId=${id}`)
			.then((response) => {
				return response.json()
			})
			.then((result) => {
				console.log(result)
				if (result?.order?.order) navigate(`/my-orders/${id}`, { state: { order: result?.order?.order } })
				else {
					showToast({ message: result?.message })
				}
			})
			.catch((error) => {
				console.log(JSON.stringify(error))
				showToast({ message: JSON.stringify(error) })
			})
	}

	return (
		<Page className='bg-gray-200'>
			{isLoading ? (
				<div className='flex flex-1 mt-12 align-center justify-center'>
					<Spinner visible />
				</div>
			) : (
				<div className='mb-20'>
					{point > 0 ? (
						<div className='my-4 mx-3 bg-green-500 px-4 py-3 flex flex-row justify-between items-center rounded-xl'>
							<Text className='text-white font-medium'>{`Điểm tích luỹ`}</Text>
							<Text className='text-xl text-white font-semibold'>{`${convertPrice(point)}`}</Text>
						</div>
					) : null}
					{Array.isArray(data) &&
						data?.map((point, index) => {
							console.log(point)
							const date = new Date(point.time);
							const formattedDate = date.toLocaleString('en-US', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
								hour12: false
							});
							return (
								<Box
									p={4}
									className='rounded-lg bg-white overflow-hidden mt-3 ml-3 mr-3'
									key={`order-${point._id}`}
									onClick={() => showOrder(point)}>
									<div className='flex'>
										{/* <img className='h-16 w-16 mr-4' src={`${firstItem?.image}`} alt={`${firstItem.name}`} /> */}
										<div className='flex flex-1 flex-col'>
											<div className='flex justify-between flex-1 mb-2'>
												<Text
													size='large'
													className='flex-1 flex-row flex items-center content-end font-semibold text-blue-500'>
													{`${point.actions === "buy" ? "mua hàng" : "liên kết"}`}
													<Text size='small' className='ml-2 font-medium'>
														-
														{point?.idOrder?.orderId?.split('_')?.[1]}
													</Text>
												</Text>
											</div>
											<div className='flex justify-between flex-1 mb-1'>
												<Text size='xxSmall' className='flex-1 content-end text-gray-400'>{`Thời gian giao dịch`}</Text>
												<Text size='xxSmall' className='font-medium text-gray-400'>
													{formattedDate}
												</Text>
											</div>
											<div className='flex justify-between flex-1'>
												<Text size='xxSmall' className='flex-1 content-end text-blue-500'>
													{point.value > 0 ? `Tích điểm` : 'Điểm sử dụng'}
												</Text>
												<Text
													size='xSmall'
													className={`font-semibold ${point.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
													{point.value > 0 ? '+' : ''}
													{convertPrice(point.value)}
												</Text>
											</div>
										</div>
									</div>
								</Box>
							)
						})}

					{data.length === 0 && (
						<Text className='text-base text-center font-regular mt-12 text-gray-600'>{'Chưa có lịch sử!'}</Text>
					)}
				</div>
			)}
		</Page>
	)
}
export default HistoryPoints

