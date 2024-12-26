import React, { useEffect, useState } from 'react'
import useSetHeader from '../../hooks/useSetHeader'
import { useRecoilValue } from 'recoil'
import { authState } from '../../states/auth'
import { Box, Page, Spinner, Text, useNavigate } from 'zmp-ui'
import { Order } from '../../models'
import { convertPrice } from '../../utils'
import { getOrders } from '../../services/order'
import { statusArray } from '../../utils/constants'

const Orders = () => {
	const setHeader = useSetHeader()
	const navigate = useNavigate()
	const authDt = useRecoilValue(authState)
	const [page, setPage] = useState(1)
	const [showLoadMore, setShowLoadMore] = useState(true)
	const [userOrders, setUserOrders] = useState<Order[]>([])
	const [activeOrderStatus, setActiveOrderStatus] = useState('processing')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setHeader({
			customTitle: 'Lịch sử đơn hàng',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
		})
	}, [])

	useEffect(() => {
		loadOrders()
	}, [page, activeOrderStatus])

	const loadOrders = async () => {
		setLoading(true)
		const orders = await getOrders(activeOrderStatus)
		console.log(orders)
		// filter order
		const filterOrder = orders?.map((o) => o.order)
		// const filterOrder = orders?.map((o) => o.order)?.filter((uOrder) => uOrder?.status === activeOrderStatus) ?? []

		setUserOrders(filterOrder)
		setLoading(false)
	}

	const onClickOrder = (order: Order) => {
		const orderId = order.id?.split('_')?.[1]
		if (orderId) {
			navigate(`/my-orders/${orderId}`, { state: { order } })
		}
	}

	return (
		<Page className='bg-gray-200'>
			<div className=' pb-32'>
				{/* Navigation top tab */}
				<div className='w-full border-b border-gray-200 overflow-auto bg-white border-t'>
					<nav className='flex space-x-2 overscroll-x-auto px-1 ' aria-label='Tabs' role='tablist'>
						{statusArray.map(({ key, label }) => {
							return (
								<button
									key={`cat_${key}`}
									type='button'
									className={`font-semibold ${
										activeOrderStatus && activeOrderStatus === key ? 'text-primary  border-b border-primary' : ''
									}  py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap`}
									data-hs-tab='#tabs-with-underline-1'
									aria-controls='tabs-with-underline-1'
									role='tab'
									onClick={() => {
										setActiveOrderStatus(key)
									}}>
									{label}
								</button>
							)
						})}
					</nav>
				</div>

				{loading ? (
					<div className='flex flex-1 mt-12 align-center justify-center'>
						<Spinner visible />
					</div>
				) : (
					<div>
						{Array.isArray(userOrders) &&
							userOrders?.map((order, index) => {
								const orderId = order.id?.split('_')?.[1] ?? '#'
								const firstItem = order?.line_items?.[0]

								return (
									<Box
										p={4}
										className='rounded-lg bg-white overflow-hidden mt-3 ml-3 mr-3'
										key={`order-${order.id}`}
										onClick={() => onClickOrder(order)}>
										<div className='flex'>
											<img className='h-16 w-16 mr-4' src={`${firstItem?.image}`} alt={`${firstItem.name}`} />
											<div className='flex flex-1 flex-col'>
												<div className='flex justify-between flex-1 mb-1'>
													<Text size='xxSmall' className='flex-1 content-end'>{`${order.date_created}`}</Text>
													<Text size='normal' className='font-semibold'>
														{convertPrice(order.total)} đ
													</Text>
												</div>
												<Text size='small' className='flex-1 text-start font-medium'>{`Mã đơn hàng: ${orderId}`}</Text>
												<Text
													size='xxSmall'
													className='flex-1 text-start mt-1'>{`${order?.line_items?.length} sản phẩm`}</Text>
											</div>
										</div>
										{/*<div className="flex">
                    <Text size="small" className="font-bold flex-1">{order.store.shop_name}</Text>
                    <Text size="xxSmall" className="text-primary">{statusArray?.find(sI => (sI.key === order.status))?.label }</Text>
                </div>*/}
										{/* {order.line_items.filter(it => (it.parent == 0)).map((litem, litemIndex) => {
                        const childItems = order.line_items?.filter(cIt => cIt.parent === litem.id);
                        let totalItemPrice = litem.price; let totalSubItemPrice = litem.subtotal;
                        if (childItems && childItems?.length > 0) {
                            childItems.map(child => {
                                totalItemPrice += child.price;
                                totalSubItemPrice += child.subtotal;
                            })
                        }

                        return (
                            <div className="flex mt-4" key={`li${litemIndex}`}>
                                <img className="h-16 w-16 mr-4" src={`${litem.image}`} alt={`${litem.name}`} />
                                <div className="w-full">
                                    <div className="flex mt-1">
                                        <div className={`flex-1 `}>
                                            <p className="font-medium text-sm">{`${litem.name}`}</p>
                                            {(childItems && childItems?.length > 0) && <div className="text-xs grey-price-color mt-1"><span>{`Đồ ăn thêm: `}</span>{childItems?.map(chItem => {
                                                return (<span>{chItem.name + ', '}</span>)
                                            })}</div>}
                                        </div>
                                    </div>
                                    <div className="flex mt-1">
                                        <Text className={"mt-1 flex-1"}>{`${litem.quantity} x ${convertPrice(totalItemPrice)} đ`}</Text>
                                        <Text className={"mt-1"}>{`${convertPrice(Number(totalSubItemPrice))} đ`}</Text>
                                    </div>
                                </div>
                            </div>
                        )
                    })} */}
										{/* <div className="flex mt-1">
                        <Text size="xxSmall" className="flex-1 text-start">{`${order.line_items.length} sản phẩm`}</Text>
                        <Text size="xxSmall" className="flex-1 text-start">{`${order.date_created}`}</Text>
                        <Text size="small" className="flex-1 text-end font-semibold">
                            <span className="mr-1">{'Thành tiền'}</span><span className="text-primary"></span>
                            {convertPrice(order.total)} đ
                        </Text>
                    </div> */}
									</Box>
								)
							})}

						{userOrders?.length === 0 && (
							<Text className='text-base text-center font-regular mt-12 text-gray-600'>{'Chưa có đơn hàng!'}</Text>
						)}
					</div>
				)}
			</div>
			{/* {showLoadMore && <div className="flex items-center justify-center text-center w-full px-4 py-4">
		    <Button onClick={()=>{
                setPage(old => old+1)
            }} color="gray">
			    <span className="pl-3">{"Xem thêm"}</span>
		    </Button>
	    </div>} */}
		</Page>
	)
}
export default Orders
