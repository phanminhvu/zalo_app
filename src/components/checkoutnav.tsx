import { Box, Button, Text, useNavigate } from 'zmp-ui'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
	cartState,
	selectedCouponState,
	selectedPaymentMethodState,
	shippingAddressState,
	shippingDateaState,
	shippingDateState,
	userOrdersState,
} from '../states/cart'
import { convertPrice } from '../utils'
import React, { useEffect, useState } from 'react'
import {
	branchTypeState,
	branchValState,
	currenTabState,
	headerState,
	pageGlobalState,
	noteState,
} from '../state'
import { Address, CartData, Coupon, Order, PaymentMethod, ShippingDate, Branch } from '../models'
import { branchsState } from '../states/home'
import moment from 'moment'
import { authState } from '../states/auth'
import { resetCartCache, saveOrderToCache, loadUserFromCache } from '../services/storage'
import { createMac } from '../services/zalo'
import { Payment } from 'zmp-sdk'
import { createOrder } from '../services/ApiClient'

const CheckoutNav = () => {
	const navigate = useNavigate()
	const setErrMsg = useSetRecoilState(pageGlobalState)

	const { showTotalCart, showBottomBar } = useRecoilValue(headerState)
	const authDt = useRecoilValue(authState)
	const [cart, setCart] = useRecoilState<CartData>(cartState)
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useRecoilState<PaymentMethod>(
		selectedPaymentMethodState,
	)
	const [selectedCoupon, setSelectedCoupon] = useRecoilState<Coupon>(selectedCouponState)
	const [userOrders, setUserOrders] = useRecoilState<Order[]>(userOrdersState)
	const [shippingDate, setShippingDate] = useRecoilState<ShippingDate>(shippingDateState)

	const [shippingDatea, setShippingDatea] = useRecoilState<ShippingDate>(shippingDateaState)

	const [shippingAddress, setShippingAddress] = useRecoilState<Address>(shippingAddressState)
	const [branchType, setBranchType] = useRecoilState<number>(branchTypeState)
	const [branchVal, setBranchVal] = useRecoilState<number>(branchValState)
	const [cua_hang, setCua_hang] = useState()
	const listBranchs = useRecoilValue<Branch[]>(branchsState)

	const [currenTab, setCurrentTab] = useRecoilState<string>(currenTabState)
	const [note, setNote] = useRecoilState<string>(noteState)
	const check = () => {
		const checkItem = cart?.cartItems?.length > 0
		let checkBranch = false
		switch (currenTab) {
			case 'giao_hang_tan_noi':
				checkBranch = !!(
					shippingAddress &&
					shippingAddress.id > 0 &&
					branchVal &&
					shippingDatea.hour !== 0
				)
				break
			case 'tai_cua_hang':
				console.log('alo', shippingDate)
				checkBranch = !!(shippingDate.hour !== 0 && branchVal)
				break
			default:
				checkBranch = false
		}
		const checkPayment = !!selectedPaymentMethod && selectedPaymentMethod?.id > 0

		return !(checkItem && checkBranch && checkPayment)
	}

	/*
    product_id: number;
  name: string;
  image: string;
  sale_price:  number | string;
  price: number | string;
  quantity: number;
  selected: boolean;
  parent: number;
  user_note: string;
    */
	useEffect(() => {
		setCua_hang(listBranchs.filter((e) => e.id == branchVal))
	}, [branchVal])
	//const location = useLocation();
	//console.log(location.pathname)
	return cart && cart?.cartItems && cart?.cartItems?.length > 0 && showTotalCart ? (
		<div
			className={`w-full fixed ${
				showBottomBar ? `bottom-[55px]` : `bottom-0`
			} left-0 shadow-btn-fixed`}>
			<div className="flex bg-white p-4 items-start justify-between">
				<Box className="w-1/2">
					<Text size="xxxSmall" className={'w-full'}>
						{cart.cartItems.length} Món ăn
					</Text>
					<Text size="xLarge" className={`font-semibold`}>{`${convertPrice(
						Number(cart?.totalCart || 0) + (cart?.deliveryFee || 0),
					)} đ`}</Text>
				</Box>
				<Button
					className="w-full "
					variant={
						((shippingAddress && shippingAddress.id > 0) || shippingDate) &&
						branchVal &&
						selectedPaymentMethod &&
						selectedPaymentMethod.id > 0
							? `primary`
							: `secondary`
					}
					size="large"
					onClick={async () => {
						//const cua_hang = listBranchs.filter((e) => e.id == branchVal);

						if (
							((shippingAddress && shippingAddress.id > 0) || shippingDate) &&
							branchVal &&
							selectedPaymentMethod &&
							selectedPaymentMethod?.id > 0
						) {
							const lineItems = cart?.cartItems.map((cartItem, cartIndex) => {
								const price =
									Number(cartItem?.sale_price) > 0 ? cartItem?.sale_price : cartItem?.price
								return {
									id: cartItem?.product_id,
									parent: cartItem?.parent,
									name: cartItem?.name,
									quantity: cartItem?.quantity,
									subtotal: Number(price) * cartItem?.quantity,
									price: price,
									image: cartItem?.image,
									user_note: cartItem?.user_note,
									weight: cartItem?.weight,
								}
							})
							let maxId = 0
							if (userOrders && userOrders?.length > 0) {
								maxId =
									userOrders?.reduce((acc, value) => {
										return (acc = acc > value.id ? acc : value.id)
									}, 0) || 0
							}
							//lineItems.reduce((acc, curentItem) => acc + curentItem.weight *curentItem.quantity, 0)
							const newOrder = {
								id: maxId + 1,
								parent_id: 0,
								status: 'processing',
								currency: 'VND',
								version: '1.0',
								total_item: Number(cart?.totalCart || 0),
								prices_include_tax: true,
								date_created: moment().format('HH:mm DD/MM/YYYY'),
								date_modified: moment().format('HH:mm DD/MM/YYYY'),
								discount_total:
									selectedCoupon && selectedCoupon?.code && selectedCoupon?.amount
										? parseInt(selectedCoupon?.discount_type || '0') == 1
											? (Number(selectedCoupon?.amount || 0) * cart?.totalCart) / 100
											: Number(selectedCoupon?.amount || 0)
										: 0,
								discount_tax: '',
								shipping_total: Number(cart?.deliveryFee || 0),
								total: Number(cart?.totalCart || 0) + Number(cart?.deliveryFee || 0),
								customer_id: authDt.profile?.id || '',
								customer_name: authDt.profile?.name || '',
								customer_phone: authDt.profile.phone || '',
								shipping: shippingAddress,
								payment_method: selectedPaymentMethod?.code,
								payment_method_title: selectedPaymentMethod?.title,
								created_via: 'zalo',
								date_completed: moment().format('HH:mm DD/MM/YYYY'),
								branch_id: branchVal,
								branch_type: branchType,
								storeId: '645389baf8c7c0f33d1eeacd',
								cua_hang: cua_hang,
								shippingDate: branchType == 0 ? shippingDatea : shippingDate,
								line_items: lineItems,
								note: `Nem nướng Quế Quân\n${note}`,
							}
							saveOrderToCache(newOrder)
							setUserOrders((old) => {
								let orders = old && old?.length > 0 ? [...old] : []
								orders.push(newOrder as Order)
								return orders
							})

							const item = lineItems.map((i) => ({
								id: i.id,
								amount: i.subtotal,
							}))

							const paymentMethod = {
								id: selectedPaymentMethod.code,
								isCustom: false,
							}

							const extraData = {
								orderId: newOrder.id,
							}

							// const totalAmount = item.reduce((acc, curentItem) => acc + curentItem.weight *curentItem.quantity, 0)

							let orderData = {
								desc: `Thanh toan ${newOrder.total}`,
								item,
								amount: newOrder.total, //newOrder.total,
								extradata: JSON.stringify(extraData),
								method: JSON.stringify(paymentMethod),
							}

							const getMac = await createMac(orderData)
							if (getMac) {
								orderData.mac = getMac.mac
								new Promise((resolve, reject) => {
									Payment.createOrder({
										...orderData,
										success: async (data) => {
											const { orderId } = data
											const rs = await createOrder(orderId, newOrder)
											console.log(orderId)
											resolve(orderId)
											resetCartCache()
											setCart({
												cartItems: [],
												totalCart: 0,
												totalCheckout: 0,
												isFetching: false,
											})
											setBranchVal(1125698)
											setShippingAddress(null)
											setShippingDate(null)
											setSelectedCoupon(null)
											navigate(`/my-orders`)
										},
										fail: (e) => {
											console.error(e)
											reject(e)
										},
									})
								})
							} else {
								console.log('Không thể tạo MAC')
							}
							//
						} else {
							navigate(`/cart`)
						}
					}}
					disabled={check()}>
					Mua hàng
				</Button>
			</div>
		</div>
	) : (
		<></>
	)
}
export default CheckoutNav
