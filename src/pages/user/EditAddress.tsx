import React, { useEffect, useState } from 'react'
import { Box, useNavigate, Text, Checkbox, Icon, Input, Select } from 'zmp-ui'
import Container from '../../components/layout/Container'
import { HiOutlineShoppingBag, HiOutlineHome } from 'react-icons/hi'
import { Button, Spinner } from 'flowbite-react'
import useSetHeader from '../../hooks/useSetHeader'
import { useRecoilValue } from 'recoil'
import { homeProductsState } from '../../states/home'
import WooWorker from '../../services/WooWorker'
import { shippingAddressState } from '../../states/cart'
import { getCities, postAddress, getDistricts, getWards } from '../../services/auth'
const EditAddress = () => {
	const setHeader = useSetHeader()
	const navigate = useNavigate()
	const shippingAddress = useRecoilValue(shippingAddressState)

	useEffect(() => {
		setHeader({
			customTitle: 'Sửa địa chỉ',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
		})
	}, [])
	const [name, setName] = useState('')
	const [phone, setPhone] = useState(sessionStorage.getItem('phoneNumber'))
	const [street, setStreet] = useState('')
	const [wardId, setWardId] = useState('')
	const [districtId, setDistrictId] = useState('')
	const [cityId, setCityId] = useState('')
	//const cities = useRecoilValue(citiesState);
	const [cities, setCities] = useState([])
	const [districts, setDistricts] = useState([])
	const [wards, setWards] = useState([])
	const [loading, setLoading] = useState(false)
	const handleOnSubmitForm = (e) => {
		e.preventDefault()
	}
	useEffect(() => {
		getCities().then((cits) => {
			setCities(cits)
			if (!shippingAddress || !shippingAddress?.city) {
				setCityId(cits[0].name)
			}
			/*WooWorker.getDistricts(cits[0].id).then((dists) => {
                setDistricts(dists);
                if(!shippingAddress || !shippingAddress?.city){
                    setDistrictId(dists[0].name);
                }
                if(dists){
                    WooWorker.getWards(dists[0].id).then((wardds) => {
                        setWards(wardds);
                        if(!shippingAddress || !shippingAddress?.city){
                            setWardId(wardds[0].name);
                        }
                    });
                }
            });*/
		})
	}, [])

	useEffect(() => {
		if (shippingAddress && shippingAddress?.first_name && shippingAddress?.city) {
			setName(shippingAddress.first_name + ' ' + shippingAddress.last_name)
			setPhone(shippingAddress?.phone)
			setStreet(shippingAddress?.address_1)
			setWardId(shippingAddress?.address_2)
			setCityId(shippingAddress?.city)
			setDistrictId(shippingAddress?.state)
		}
	}, [shippingAddress])
	useEffect(() => {
		if (cityId && cities && cities.length > 0) {
			const crCity = cities.find((ct) => ct.name.localeCompare(cityId) === 0)
			if (crCity && crCity?.code) {
				getDistricts(crCity?.code).then((dists) => {
					setDistricts(dists)
					if (dists && (!shippingAddress || !shippingAddress?.city)) {
						setDistrictId(dists[0].name)
					}
				})
			}
		}
	}, [cityId, cities])
	useEffect(() => {
		if (districtId && districts && districts.length > 0) {
			const crCity = cities.find((ct) => ct.name.localeCompare(cityId) === 0)
			const crrDistrict = districts.find((ds) => ds.name.localeCompare(districtId) === 0)
			if (crCity && crCity?.code && crrDistrict && crrDistrict?.code) {
				getWards(crCity?.code, crrDistrict?.code).then((wardds) => {
					setWards(wardds)
					if (wardds && (!shippingAddress || !shippingAddress?.city)) {
						setWardId(wardds[0].name)
					}
				})
			}
		}
	}, [districtId, districts])
	const { OtpGroup, Option } = Select

	return (
		<Container>
			<Box mt={1} className={'bg-white p-4'}>
				<Input
					type='text'
					size={'small'}
					placeholder='Họ và Tên'
					onChange={(e) => {
						setName(e.target.value)
					}}
					value={name}
					className='mt-2 border-slate-200'
				/>
				<Input
					type='number'
					size={'small'}
					placeholder='Số điện thoại'
					onChange={(e) => {
						setPhone(e.target.value)
					}}
					value={phone}
					className='mt-2 border-slate-200'
				/>
				<Input
					type='text'
					size={'small'}
					placeholder='Địa chỉ'
					value={street}
					onChange={(e) => {
						setStreet(e.target.value)
					}}
					className='mt-2 border-slate-200'
				/>
				{cities && cities.length > 0 && (
					<Box mt={1}>
						<Select
							label='Thành phố'
							defaultValue={cities[0].id}
							value={cities.find((ct) => ct.name.localeCompare(cityId) === 0)?.code}
							onChange={(cId) => {
								setCityId(cities.find((ct) => ct.code === cId)?.name)
								getDistricts(cId).then((dists) => {
									setDistricts(dists)
									if (dists) {
										getWards(cId, dists[0].code).then((wardds) => {
											setWards(wardds)
										})
									}
								})
							}}
							closeOnSelect>
							{cities.map((city, cIndex) => {
								return <Option key={`city${cIndex}`} value={city.code} title={city.name} />
							})}
						</Select>
						{districts && (
							<Select
								label='Quận/Huyện'
								defaultValue={districts && districts.length > 0 ? districts[0].id : ''}
								value={
									districtId && districts.find((dis) => dis.name.localeCompare(districtId) === 0)
										? districts.find((dis) => dis.name.localeCompare(districtId) === 0)?.id
										: ''
								}
								onChange={(dId) => {
									setDistrictId(districts.find((dis) => dis.id === dId)?.name)
									getWards(cities.find((ct) => ct.name.localeCompare(cityId) === 0).code, dId).then((wardds) => {
										setWards(wardds)
									})
								}}
								closeOnSelect>
								{districts.map((district, dIndex) => {
									return <Option key={`district${dIndex}`} value={district.code} title={district.name} />
								})}
							</Select>
						)}

						{wards && (
							<Select
								label='Phường/Xã'
								defaultValue={wards && wards.length > 0 ? wards[0].id : ''}
								value={
									wardId && wards.find((wd) => wd.name.localeCompare(wardId) === 0)
										? wards.find((wd) => wd.name.localeCompare(wardId) === 0)?.code
										: ''
								}
								onChange={(wId) => {
									setWardId(wards.find((wis) => wis.code === wId)?.name)
								}}
								closeOnSelect>
								{wards.map((ward, wIndex) => {
									return <Option key={`ward${wIndex}`} value={ward.code} title={ward.name} />
								})}
							</Select>
						)}
					</Box>
				)}
				<Button.Group className={`flex w-full  bottom-0 mt-4`}>
					<Button
						className={`flex-1 border-l-0 border-b-0 rounded-none bg-pink-900`}
						onClick={async () => {
							setLoading(true)
							await postAddress(
								{
									shipping_address_1: street,
									shipping_address_2: wardId,
									shipping_state: districtId,
									shipping_city: cityId,
									shipping_postcode: '',
									shipping_country: 'VN',
									shipping_email: '',
									shipping_phone: phone,
									shipping_first_name: name,
									shipping_last_name: '',
								},
								(result) => {
									setLoading(false)
								},
							)
						}}>
						{loading && <Spinner size='sm' />}
						<span className='pl-3'>{loading ? `Đang tải ...` : `Lưu`}</span>
					</Button>
					<Button
						className={`flex-1 border-l-0 border-r-0 border-b-0 rounded-none`}
						onClick={() => {
							navigate('/checkout')
						}}>
						<p>Đóng</p>
					</Button>
				</Button.Group>
			</Box>
		</Container>
	)
}
export default EditAddress
