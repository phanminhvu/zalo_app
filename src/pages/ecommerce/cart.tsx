import React, { useEffect, useState } from 'react'
import useSetHeader from '../../hooks/useSetHeader'
import { Box, Picker, Tabs, Text, useNavigate, Page, List, Icon, Button, Input, Modal, Checkbox } from 'zmp-ui'
import { HiLocationMarker, HiMap, HiOutlineArrowRight, HiOutlineClock } from 'react-icons/hi'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
	cartState,
	selectedCouponState,
	selectedPaymentMethodState,
	shippingAddressState,
	shippingDateaState,
	shippingDateState,
} from '../../states/cart'
import { convertPrice } from '../../utils'
import {
	Address,
	AuthData,
	Branch,
	CartData,
	Coupon,
	PaymentMethod,
	Product,
	ProductInfoPicked,
	ShippingDate,
} from '../../models'
import { useAddProductToCart } from '../../hooks'
import {
	branchLatState,
	currenTabState,
	branchLngState,
	//branchPointState,
	branchTypeState,
	branchValState,
	openAddressPickerState,
	openCouponPickerState,
	openPaymentMethodPickerState,
	openProductPickerState,
	openProductsPickerState,
	useScoreState,
	openStoresPickerState,
	pageGlobalState,
	productInfoPickedState,
	userAddressesState,
	userEditingAddressState,
	noteState,
} from '../../state'
import Container from '../../components/layout/Container'
import { branchsState, couponsState, homeProductsState } from '../../states/home'
import ArrowObject from '../../components/checkout/arrow-object'
import moment, { now } from 'moment'
import { VIET_MAP_KEY } from '../../utils/constants'
import { VietmapApi } from '@vietmap/vietmap-api'
import cod from '../../components/buy.png'
import bank from '../../components/bank.png'
import {
	loadCartFromCache,
	loadOrderFromCache,
	loadPhoneFromCache,
	loadUserFromCache,
	saveUserToCache,
} from '../../services/storage'
import { authorizeV2, getPhoneNumberUser, getSettingV2 } from '../../services/zalo'
import { authState } from '../../states/auth'
import { getSetting } from 'zmp-sdk'

const UserCart = () => {
	const navigate = useNavigate()
	const [cart, setCart] = useRecoilState<CartData>(cartState)
	const [distance, setDistance] = useState<number>(0)
	const [deliveryFee, setDeliveryFee] = useState<number | null>(null)
	useEffect(() => {
		setDeliveryFee(phiGiaohang(distance / 1000))
		setCart({
			...cart,
			deliveryFee: phiGiaohang(distance / 1000),
		})
	}, [distance])

	const [currenTab, setCurrentTab] = useRecoilState<string>(currenTabState)
	const [note, setNote] = useRecoilState<string>(noteState)

	const [buyDatea, setBuyDatea] = useState('')
	const [buyHoura, setBuyHoura] = useState(0)
	const [buyMinutea, setBuyMinutea] = useState(0)

	const coupons = useRecoilValue<Coupon[]>(couponsState)
	const selectedCoupon = useRecoilValue<Coupon>(selectedCouponState)
	const setHeader = useSetHeader()
	const setProductInfoPicked = useSetRecoilState(productInfoPickedState)
	const setOpenSheet = useSetRecoilState(openProductPickerState)
	const products = useRecoilValue<Product[]>(homeProductsState)
	const setNotes = useSetRecoilState<string[]>(noteState)
	const setOpenProductsSheet = useSetRecoilState(openProductsPickerState)
	const mintime = 8
	const maxtime = 18
	const now = new Date()
	now.setMinutes(now.getMinutes() + 15)
	//now.setHours(10)//now.getHours()+18)
	const roundMinutes = (mm: number) => {
		if (mm == 0) {
			return 0
		} else if (mm <= 15) {
			return 15
		} else if (mm <= 30) {
			return 30
		} else {
			return 45
		}
	}

	const deftime = (mintime: number, maxtime: number) => {
		const hh = now.getHours()
		const mm = now.getMinutes()
		const defValue: { hh: number; mm: number } = { hh: 0, mm: 0 }
		if (hh < mintime || hh > maxtime) {
			defValue.hh = mintime
			defValue.mm = 0
		} else if (hh == maxtime && mm <= 45) {
			defValue.hh = maxtime
			defValue.mm = roundMinutes(mm)
		} else if (hh == maxtime && mm > 45) {
			defValue.hh = mintime
			defValue.mm = 0
		} else if (hh >= mintime && hh < maxtime && mm <= 45) {
			defValue.hh = hh
			defValue.mm = roundMinutes(mm)
		} else {
			defValue.hh = hh + 1
			defValue.mm = 0
		}
		return defValue
	}

	const [buyDate, setBuyDate] = useState('')
	const [buyHour, setBuyHour] = useState(0)
	const [buyMinute, setBuyMinute] = useState(0)

	const [openAddressSSheet, setOpenAddressSheet] = useRecoilState<boolean>(openAddressPickerState)
	const [point, setPoint] = useState(0)
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useRecoilState<PaymentMethod>(selectedPaymentMethodState)

	const [userAddresses, setUserAddresses] = useRecoilState<Address[]>(userAddressesState)

	const [shippingAddress, setShippingAddress] = useRecoilState<Address>(shippingAddressState)
	const [shippingDate, setShippingDate] = useRecoilState<ShippingDate>(shippingDateState)

	const [shippingDatea, setShippingDatea] = useRecoilState<ShippingDate>(shippingDateaState)

	const [openStoreSheet, setOpenStoreSheet] = useRecoilState<boolean>(openStoresPickerState)
	const [openCouponSheet, setOpenCouponSheet] = useRecoilState<boolean>(openCouponPickerState)
	const [openPaymentMethodSheet, setOpenPaymentMethodSheet] = useRecoilState<boolean>(openPaymentMethodPickerState)

	const [branchVal, setBranchVal] = useRecoilState<number>(branchValState)
	const [branchType, setBranchType] = useRecoilState<number>(branchTypeState)

	const [branchLat, setBranchLat] = useRecoilState<number>(branchLatState)

	const [branchLng, setBranchLng] = useRecoilState<number>(branchLngState)
	const [popupVisible, setPopupVisible] = useState(false)
	const [useScore, setUseScore] =  useRecoilState<boolean>(useScoreState)

	console.log(useScore , 'useScore')

	useEffect(() => {
		// setBranchType(0);
		if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
			if (userAddresses?.filter((data) => data.default).length > 0) {
				setShippingAddress(userAddresses.filter((data) => data.default)[0])
			}
		}

		getSetting().then((value) => {
			console.log(value)
			if (!value.authSetting?.['scope.userPhonenumber']) {
				// authorizeV2()
				setPopupVisible(true)
			}
		})
	}, [])

	const vietmapApi = new VietmapApi({ apiKey: VIET_MAP_KEY })
	const getDistance = async () => {
		const distance = await vietmapApi.route(
			[
				[branchLat, branchLng],
				[shippingAddress.lat as number, shippingAddress.lng as number],
			],
			{ vehicle: 'motorcycle', apikey: VIET_MAP_KEY, points_encoded: true, optimize: false },
		)
		setDistance(distance.paths[0].distance)
		// if(distance && distance > 0) {
		//     setDeliveryFee(phiGiaohang(distance /1000));
		// }
	}

	useEffect(() => {
		if (
			branchType === 0 &&
			branchLat &&
			branchLng &&
			shippingAddress &&
			shippingAddress?.lat &&
			shippingAddress?.lng &&
			branchLat > 0 &&
			branchLng > 0 &&
			currenTab == 'giao_hang_tan_noi'
		) {
			getDistance()
		}
		if (currenTab == 'tai_cua_hang') {
			setDistance(0)
		}
		if (branchType !== 0) {
			setDistance(0)
		}
	}, [branchLng, branchLat, shippingAddress, currenTab, branchType])
	const branchs = useRecoilValue<Branch[]>(branchsState)
	const [authDt, setAuthDt] = useRecoilState<AuthData>(authState)
	useEffect(() => {
		setHeader({
			customTitle: 'Giỏ hàng',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
			showTotalCart: true,
		})
		let userInfo = {}
		const getinfouser = async () => {
			userInfo = await loadUserFromCache()
			if (!(userInfo && userInfo?.id)) {
				setPopupVisible(true)
			}
			const phone = await loadPhoneFromCache()
			if (!phone) {
				setPopupVisible(true)
			}
		}
		getinfouser()
	}, [])

	function generateDateListFromToday(days: number): string[] {
		let dateList: string[] = []
		let today = new Date(now.getTime() + 7 * 60 * 60 * 1000)
		let j = 0

		if (now.getHours() > maxtime || (now.getHours() == maxtime && now.getMinutes() > 45)) {
			j = 1
		}
		for (let i = 0; i < days; i++) {
			let currentDate = new Date(today)
			currentDate.setDate(today.getDate() + i + j) // Tăng ngày thêm i ngày
			dateList.push(currentDate.toISOString().split('T')[0]) // Chuyển đổi thành định dạng YYYY-MM-DD
		}
		return dateList
	}

	const genHourData = (i: number) => {
		let currentHour = i == 1 ? deftime(mintime, maxtime).hh : mintime
		const data: { value: number; displayName: string }[] = []
		for (let i = currentHour; i <= maxtime; i++) {
			data.push({
				value: i,
				displayName: `${i < 10 ? `0${i}` : i}`,
			})
		}
		return data
	}
	const [genHourDataState, setgenHourDataState] = useState(genHourData(1))

	const getImageSource = (code: string) => {
		let source = ''
		switch (code) {
			case 'COD':
				source = cod
				break
			case 'BANK':
				source = bank
				break
		}
		return source
	}
	const genMinuteData = (daysString: string, hourSelect: number) => {
		const data: { value: number; displayName: string }[] = []
		if (daysString != 'Hôm nay') {
			for (let i = 0; i < 60; i = i + 15) {
				data.push({
					value: i,
					displayName: `${i < 10 ? `0${i}` : i}`,
				})
			}
		} else if (daysString == 'Hôm nay' && hourSelect != deftime(mintime, maxtime).hh) {
			for (let i = 0; i < 60; i = i + 15) {
				data.push({
					value: i,
					displayName: `${i < 10 ? `0${i}` : i}`,
				})
			}
		} else {
			for (let i = deftime(mintime, maxtime).mm; i < 60; i = i + 15) {
				data.push({
					value: i,
					displayName: `${i < 10 ? `0${i}` : i}`,
				})
			}
		}
		return data
	}

	const [genMmDataState, setgenMmDataState] = useState(genMinuteData('Hôm nay', deftime(mintime, maxtime).hh))

	const genDateData = () => {
		let listDate = generateDateListFromToday(3)
		let daysOfYear: { value: string; displayName: string }[] = []
		let today = now
		if (today.getHours() <= maxtime) {
			listDate.forEach((element, i) => {
				daysOfYear.push({
					value: moment(element).format('DD/MM/YYYY'),
					displayName: i == 0 ? 'Hôm nay' : moment(element).format('DD/MM/YYYY'),
				})
			})
		} else {
			listDate.forEach((element, i) => {
				daysOfYear.push({
					value: moment(element).format('DD/MM/YYYY'),
					displayName: moment(element).format('DD/MM/YYYY'),
				})
			})
		}
		return daysOfYear
	}

	useEffect(() => {
		setShippingDate({
			date: buyDate,
			hour: buyHour,
			minute: buyMinute,
		})
	}, [buyDate, buyHour, buyMinute])

	useEffect(() => {
		const userId = authDt?.profile?.id
		if (userId) {
			fetch(`https://quequan.vn:8081/customer/zalo-customer-point?userid=${userId}`)
				.then((response) => {
					return response.json()
				})
				.then((result) => {
					console.log(result,)
					if (result?.point) setPoint(result?.point)
				})
				.catch((error) => console.log(JSON.stringify(error)))
		}
	}, [authDt?.profile?.id])

	useEffect(() => {
		setShippingDatea({
			date: buyDatea,
			hour: buyHoura,
			minute: buyMinutea,
		})
	}, [buyDatea, buyHoura, buyMinutea])

	const phiGiaohang = (distance: number) => {
		if (distance == 0) {
			return 0
		} else if (distance <= 2) {
			return 20000
		} else if (distance <= 3) {
			return 25000
		} else if (distance <= 5) {
			return 30000
		} else if (distance <= 7) {
			return 35000
		} else if (distance <= 9) {
			return 45000
		} else if (distance <= 11) {
			return 50000
		} else if (distance <= 12) {
			return 55000
		} else if (distance <= 13) {
			return 60000
		} else if (distance <= 14) {
			return 65000
		}
		else if (distance <= 15) {
			return 70000
		}
		else if (distance <= 16) {
			return 75000
		}
		else if (distance <= 17) {
			return 80000
		}
		else if (distance <= 18) {
			return 85000
		}
		else if (distance <= 19) {
			return 90000
		}
		else if (distance <= 20) {
			return 95000
		}
		else return 100000
		// if (distance === 0) {
		//     return 0
		// }else if (distance <= 3) {
		//     return 16000
		// } else {
		//     return 16000 + (distance - 3) * 5500

		// }
	}
	const ChonCuaHang = () => {
		return (
			<List.Item
				onClick={() => {
					setOpenStoreSheet(true)
				}}
				prefix={<HiMap className='h-5 w-5 ' />}
				title={
					<Text bold className={'zaui-link-text-color'}>
						Vị trí cửa hàng
					</Text>
				}
				suffix={<Icon icon='zi-chevron-right' />}
				subTitle={branchVal > 0 ? branchs.find((bit) => bit.id === branchVal)?.name : `Vui lòng chọn cửa hàng`}>
				{branchVal > 0 ? branchs.find((bit) => bit.id === branchVal)?.address : ''}
			</List.Item>
		)
	}

	const onChangeSelectDatea = (value) => {
		if (value?.date && value?.date.value != buyDatea) {
			// run khi doi ngay
			if (value.date?.displayName == 'Hôm nay') {
				setgenHourDataState(genHourData(1))
				setgenMmDataState(genMinuteData(value.date?.displayName, deftime(mintime, maxtime).hh))
				console.log(value)
			} else {
				setgenHourDataState(genHourData(0))
				setgenMmDataState(genMinuteData(value.date?.displayName, 0))
				console.log(value)
			}
		}

		if (value?.hour && value?.hour.value != buyHoura) {
			setgenMmDataState(genMinuteData(value.date?.displayName, value?.hour.value))
		}

		if (value?.hour?.value) setBuyHoura(value.hour.value)
		if (value?.minute?.value) setBuyMinutea(value.minute.value)
		if (value?.date?.value) setBuyDatea(value.date.value)
	}
	const onChangeSelectDate = (value) => {
		if (value?.date && value?.date.value != buyDate) {
			// run khi doi ngay
			if (value.date?.displayName == 'Hôm nay') {
				setgenHourDataState(genHourData(1))
				setgenMmDataState(genMinuteData(value.date?.displayName, deftime(mintime, maxtime).hh))
				console.log(value)
			} else {
				setgenHourDataState(genHourData(0))
				setgenMmDataState(genMinuteData(value.date?.displayName, 0))
				console.log(value)
			}
		}

		if (value?.hour && value?.hour.value != buyHour) {
			setgenMmDataState(genMinuteData(value.date?.displayName, value?.hour.value))
		}

		if (value?.hour?.value) setBuyHour(value.hour.value)
		if (value?.minute?.value) setBuyMinute(value.minute.value)
		if (value?.date?.value) setBuyDate(value.date.value)
	}

	const loginEff = async () => {
		const userInfo = await authorizeV2()

		let zaloSettings = await getSettingV2()
		if (zaloSettings['authSetting']['scope.userInfo'] === true) {
			setAuthDt({
				...authDt,
				profile: userInfo,
			})
			saveUserToCache(userInfo)
			getPhoneNumberUser()
		} else {
			setAuthDt({
				...authDt,
				profile: {
					birthday: '',
					email: '',
					id: null,
					name: '',
					sex: 0,
					phone: '',
					picture: '',
					zalo_data: {
						avatar: '',
						followedOA: false,
						id: '',
						isSensitive: false,
						name: '',
					},
					zalo_id: '',
				},
				token: '',
			})
		}

		const cachedCart = await loadCartFromCache()
		setCart(cachedCart)
		const cachedOrders = await loadOrderFromCache()
		setUserOrders(cachedOrders)
	}

	return (
		<Container className={''}>
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
							loginEff()
						}}
						fullWidth>
						Xác nhận
					</Button>
				</Box>
			</Modal>

			<div className='container mx-auto pt-4  pb-48  zui-container-background-color'>
				<div className='flex flex-col md:flex-row gap-4'>
					<div className='md:w-3/4'>
						<div className='w-full'>
							<div className={`px-4`}>
								{cart && cart?.cartItems ? (
									<div
										className={
											'w-full bg-white items-center justify-center align-middle rounded-lg mb-4 p-4 shadow-btn-fix--ed'
										}>
										{cart?.cartItems?.filter((cItem) => cItem.parent === 0).length > 0 ? (
											<table className='w-full'>
												<tbody>
													{cart?.cartItems
														?.filter((cItem) => cItem.parent === 0)
														.map((cartItem, cartIndex) => {
															const childItems = cart.cartItems?.filter((cIt) => cIt.parent === cartItem.product_id)
															let totalItemPrice =
																parseFloat(cartItem.sale_price + '') > 0 ? cartItem.sale_price : cartItem.price
															if (childItems && childItems?.length > 0) {
																childItems.map((child) => {
																	totalItemPrice +=
																		parseFloat(child.sale_price + '') > 0 ? child.sale_price : child.price
																})
															}

															return (
																<tr
																	key={`cart_item${cartIndex}`}
																	onClick={() => {
																		setProductInfoPicked((info) => {
																			return {
																				...info,
																				product: products.find((cIt) => cIt.id === cartItem.product_id),
																				currentItem: cartItem,
																			} as ProductInfoPicked
																		})
																		setOpenSheet(true)
																	}}>
																	<td className='py-4'>
																		<div className='flex items-start'>
																			<img
																				className='w-[60px] h-[60px] mr-4 rounded-lg'
																				src={`${cartItem.image}`}
																				alt={`${cartItem.name}`}
																			/>
																			<div className='flex-1'>
																				<p className='font-medium text-sm zblack-color'>{`${cartItem.name}`}</p>
																				<p className='text-sm grey-price-color mt-1'>{`${convertPrice(
																					totalItemPrice,
																				)} đ`}</p>
																				{childItems && childItems?.length > 0 && (
																					<div className='text-xs grey-price-color mt-1'>
																						<span>{`Đồ ăn thêm: `}</span>
																						{childItems?.map((chItem) => {
																							return <span>{chItem.name + ', '}</span>
																						})}
																					</div>
																				)}
																			</div>
																			<span className='text-sm text-center w-8 zaui-link-text-color'>{`x ${cartItem.quantity}`}</span>
																		</div>
																	</td>
																</tr>
															)
														})}
												</tbody>
											</table>
										) : (
											<div className={'w-full items-center justify-center p-4'}>
												<Text size={`xxxSmall`} className='text-center'>
													Không có món ăn, thức uống trong giỏ hàng
												</Text>
											</div>
										)}
									</div>
								) : (
									<div
										className={
											'w-full bg-white items-center justify-center align-middle rounded-lg mb-4 p-4 shadow-btn-fixed'
										}>
										<div className={'w-full items-center justify-center p-4'}>
											<Text size={`xxxSmall`} className='text-center'>
												Không có món ăn, thức uống trong giỏ hàng
											</Text>
										</div>
									</div>
								)}
								<Text
									size={`xSmall`}
									style={{ float: 'right' }}
									className={`zaui-link-text-color bg-[#088c4c] text-white rounded-3xl pt-1 pb-1 pl-3 pr-3  font-semibold`}
									onClick={() => {
										setOpenProductsSheet(true)
									}}>
									Thêm +
								</Text>
							</div>

							<Box mt={14} className={`px-4 mt-14`}>
								<div className={`w-full bg-white rounded-lg p-4`}>
									<Text bold size={'xLarge'} className={`mb-2`}>{`Tổng cộng`}</Text>

									<List noSpacing>
										<List.Item title='Thành tiền' suffix={`${convertPrice(Number(useScore ? cart?.totalCart - point > 0 ? cart?.totalCart - point : 0 : cart?.totalCart || 0))} đ`} />
										<List.Item
											title='Mã giảm giá'
											suffix={
												selectedCoupon && selectedCoupon?.code
													? parseInt(selectedCoupon?.discount_type || '0') !== 1
														? `${convertPrice(Number(selectedCoupon?.amount || 0))} đ`
														: `${convertPrice((Number(selectedCoupon?.amount || 0) * cart?.totalCart) / 100)} đ`
													: ''
											}
										/>
										<List.Item
											title='Phí giao hàng'
											suffix={`${convertPrice(Number(deliveryFee))} đ`}
											subTitle={`${(distance / 1000).toFixed(distance > 0 ? 2 : 0)} km`}
										/>
										<List.Item
											title={<Text className={'font-bold'}>{`Số tiền thanh toán`}</Text>}
											suffix={`${convertPrice(Number((useScore ? cart?.totalCart - point > 0 ? cart?.totalCart - point : 0 : cart?.totalCart || 0) + (deliveryFee || 0)))} đ`}
										// subTitle={(distance && (distance / 1000).toFixed(2) + ' km')}
										/>
									</List>

									<Checkbox checked={useScore} onChange={(e) => { setUseScore(e.target.checked) }}
										label={<p>Bạn đang có <span className={'font-bold'}  >{`${point} đ`}</span> tiền thưởng. Bạn có muốn sử dụng?</p>} />

								</div>
							</Box>

							<Box mt={4} className={`px-4 `}>
								<div className={`w-full bg-white rounded-lg p-4`}>
									<Tabs
										id='contact-list'
										activeKey={currenTab}
										onChange={(activeKey) => {
											setCurrentTab(activeKey)
											console.log('activeKey', activeKey)
											setBranchType(activeKey === 'tai_cua_hang' ? 1 : 0)
										}}>
										<Tabs.Tab key='giao_hang_tan_noi' label='Giao tận nơi'>
											<List noSpacing>
												<ChonCuaHang></ChonCuaHang>
												<List.Item
													onClick={() => {
														// navigate('/my-addresses/cart');
														setOpenAddressSheet(true)
													}}
													prefix={<HiLocationMarker className='h-5 w-5 ' />}
													title={
														<Text bold className={'zaui-link-text-color'}>
															Địa chỉ
														</Text>
													}
													suffix={<Icon icon='zi-chevron-right' />}
													subTitle={
														shippingAddress && shippingAddress?.id
															? shippingAddress.name + `  ${shippingAddress.phone ? `- ${shippingAddress.phone}` : ''}`
															: `Vui lòng chọn địa chỉ`
													}>
													{shippingAddress && shippingAddress?.id ? shippingAddress.address : ``}
												</List.Item>

												<List.Item>
													<Picker
														placeholder='Chọn thời gian'
														mask
														title='Thời gian nhận hàng'
														maskClosable
														prefix={<HiOutlineClock className='mr-4 h-5 w-5' />}
														suffix={<Icon icon='zi-chevron-right' />}
														inputClass='border-none w-full flex bg-transparent  text-base text-black font-medium text-md m-0 p-0 h-auto picker-custom'
														formatPickedValueDisplay={(test) => {
															console.log('_____________', test)
															return test && test?.hour && test?.minute && test?.date
																? `${test?.hour?.displayName} : ${test?.minute?.displayName} - ${test?.date?.displayName}`
																: `Chọn thời gian`
														}}
														value={{ hour: buyHoura, minute: buyMinutea, date: buyDatea }}
														data={[
															{
																options: genHourDataState,
																name: 'hour',
															},
															{
																options: genMmDataState,
																name: 'minute',
																onChange: (value, name) => {
																	console.log('đang đổi phút', value, name)
																},
															},
															{
																options: genDateData(),
																name: 'date',
																onChange: (value, name) => {
																	console.log('đang đổi ngày', value, name)
																},
															},
														]}
														onChange={onChangeSelectDatea}
													/>
												</List.Item>
											</List>
										</Tabs.Tab>
										<Tabs.Tab key='tai_cua_hang' label='Lấy tại cửa hàng'>
											<List noSpacing>
												<ChonCuaHang></ChonCuaHang>
												<List.Item>
													<Picker
														placeholder='Chọn thời gian'
														mask
														title='Thời gian nhận hàng'
														maskClosable
														prefix={<HiOutlineClock className='mr-4 h-5 w-5' />}
														suffix={<Icon icon='zi-chevron-right' />}
														inputClass='border-none w-full flex bg-transparent  text-base text-black font-medium text-md m-0 p-0 h-auto picker-custom'
														formatPickedValueDisplay={(test) =>
															test && test?.hour && test?.minute && test?.date
																? `${test?.hour?.displayName} : ${test?.minute?.displayName} - ${test?.date?.displayName}`
																: `Chọn thời gian`
														}
														value={{ hour: buyHour, minute: buyMinute, date: buyDate }}
														data={[
															{
																options: genHourDataState,
																name: 'hour',
															},
															{
																options: genMmDataState,
																name: 'minute',
															},
															{
																options: genDateData(),
																name: 'date',
															},
														]}
														onChange={onChangeSelectDate}
													/>
												</List.Item>
											</List>
										</Tabs.Tab>
									</Tabs>
								</div>
							</Box>
							{/*{(!cart || !cart?.cartItems?.length) &&*/}
							{/*    <div className={'py-8 px-4'}><Text>{`Không có sản phẩm nào trong giỏ hàng`}</Text></div>}*/}
							<Box mt={4} className={`px-4 `}>
								<div className={`w-full bg-white rounded-lg p-4`}>
									<List noSpacing>
										<List.Item
											onClick={() => {
												setOpenCouponSheet(true)
											}}
											prefix={<Icon icon='zi-star' />}
											title={
												<Text bold className={'text-[#088c4c]'}>
													Chọn mã khuyến mãi
												</Text>
											}
											suffix={<Icon icon='zi-chevron-right' />}
											subTitle={
												selectedCoupon && selectedCoupon?.code
													? parseInt(selectedCoupon?.discount_type || '0') !== 1
														? `${convertPrice(Number(selectedCoupon?.amount || 0))} đ`
														: `${convertPrice((Number(selectedCoupon?.amount || 0) * cart?.totalCart) / 100)} đ`
													: ''
											}
										/>

										<List.Item
											prefix={<Icon icon='zi-note' />}
											title={
												<Input
													focused={false}
													size={'small'}
													className={'border-none w-full no-border-focus pb-3'}
													placeholder='Nhập ghi chú...'
													onChange={(e) => setNote(e.target.value)}
												/>
											}
										/>
									</List>
								</div>
								{/*<ArrowObject title={`Mã giảm giá`} padding={0} textSize={"large"}*/}
								{/*             content={(selectedCoupon && selectedCoupon?.code) ? selectedCoupon.description : ``}*/}
								{/*             subcontent=*/}
								{/*                 {(selectedCoupon && selectedCoupon?.code) ? (parseInt(selectedCoupon?.discount_type || '0') !== 1 ? `${convertPrice(Number(selectedCoupon?.amount || 0))} đ` : `${convertPrice(Number(selectedCoupon?.amount || 0) * cart?.totalCart / 100)} đ`) : ''}*/}
								{/*             contentTextColor={`text-sky-500`} onClick={() => {*/}
								{/*    setOpenCouponSheet(true)*/}
								{/*}} rightcontent={''} extraClassName={`w-full bg-white rounded-lg p-4`}></ArrowObject>*/}
								{/*coupons && <Coupons coupons={coupons}/>*/}
							</Box>

							<Box mt={4} className={`px-4 `}>
								<div className={`w-full bg-white rounded-lg p-4`}>
									<Text bold size={'xLarge'} className={`mb-2`}>{`Phương thức thanh toán`}</Text>

									{selectedPaymentMethod ? (
										<List noSpacing>
											<List.Item
												onClick={() => {
													//setSelectedPaymentMe`thod(true)
													setOpenPaymentMethodSheet(true)
												}}
												prefix={<img className='w-9 h-9' src={getImageSource(selectedPaymentMethod?.code as string)} />}
												title={
													<Text bold className={'text-[#088c4c]'}>
														{selectedPaymentMethod && selectedPaymentMethod?.id ? selectedPaymentMethod?.title : ``}
													</Text>
												}
												suffix={<Icon icon='zi-chevron-right' />}
												subTitle={
													<p
														dangerouslySetInnerHTML={{
															__html: selectedPaymentMethod?.notes ? selectedPaymentMethod?.notes : '',
														}}
													/>
												}
											/>
										</List>
									) : (
										<></>
									)}
								</div>
							</Box>
							<Text className={'pl-5 pr-5 pt-10 text-gray-500'}>
								Bằng việc tiến hành thanh toán, bạn đồng ý với điều kiện và điều khoản sử dụng Zalo Mini app
							</Text>
						</div>
					</div>
				</div>
			</div>
		</Container>
	)
}
export default UserCart
function genMinuteData(arg0: string, arg1: number): any {
	throw new Error('Function not implemented.')
}

function generateDateListFromToday(arg0: number) {
	throw new Error('Function not implemented.')
}

function setAuthDt(arg0: any) {
	throw new Error('Function not implemented.')
}

function setUserOrders(cachedOrders: any) {
	throw new Error('Function not implemented.')
}
