import React, { useEffect, useRef } from 'react'
import { loadAddresses } from '../services/storage'
import {
	isMappingState,
	pageGlobalState,
	userAddressesState,
	userEditingAddressState,
} from '../state'
import { Button, Icon, List, Sheet, Text, useNavigate } from 'zmp-ui'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Address, AuthData, Branch } from '../models'
import { useSetHeader } from '../hooks'
import { useParams } from 'react-router-dom'
import { shippingAddressState } from '../states/cart'
import { authState } from '../states/auth'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { openAddressPickerState, openStoresPickerState } from '../state'

const AddressesPicker: React.FunctionComponent = () => {
	let { from } = useParams()
	const [userAddresses, setUserAddresses] = useRecoilState<Address[]>(userAddressesState)

	const [isMapping, setIsMapping] = useRecoilState<boolean>(isMappingState)
	const [openSheet, setOpenSheet] = useRecoilState<boolean>(openAddressPickerState)
	const setErrMsg = useSetRecoilState(pageGlobalState)
	const [userEditingAddress, setUserEditingAddress] =
		useRecoilState<Address>(userEditingAddressState)
	const setHeader = useSetHeader()
	const [shippingAddress, setShippingAddress] = useRecoilState<Address>(shippingAddressState)

	const authDt = useRecoilValue<AuthData>(authState)
	const navigate = useNavigate()
	useEffect(() => {
		// setHeader({
		//     customTitle: "Quản lý địa chỉ",
		//     hasLeftIcon: true,
		//     type: "secondary",
		//     showBottomBar: true
		// });
		const gAddresses = async () => {
			//await saveAddress(uaddresses[0])
			const cachedUserAddresses = await loadAddresses()
			setUserAddresses(cachedUserAddresses)
		}
		gAddresses()
	}, [])

	const sheet = useRef<any>(null)

	const { Item } = List
	return (
		userAddresses && (
			<Sheet
				className={'bg-white'}
				mask
				visible={openSheet}
				height={'90%'}
				swipeToClose
				maskClosable
				onClose={() => setOpenSheet(false)}
				ref={sheet}
				autoHeight>
				<div className="p-0 bg-white overflow-y-auto max-h-full" style={{ marginBottom: '0px' }}>
					{
						<List className="  py-4">
							{userAddresses.map((address, index) => {
								return (
									<Item
										key={`address${index}`}
										className={`mb-4 p-4 bg-white`}
										title={'Địa chỉ'}
										prefix={<HiOutlineLocationMarker className="mr-2 mt-6 h-5 w-5 inline-block" />}
										subTitle={address.address}
										children={
											<Text className={'zaui-list-item-subtitle'}>
												{address.name + ' ' + address.phone}
											</Text>
										}
										onClick={() => {
											setShippingAddress(address)
											setOpenSheet(false)
										}}
										suffix={
											<Button
												variant={`tertiary`}
												className={
													'p-0 min-w-0 h-8 w-8 leading-0 rounded-full zui-container-background-color mt-5'
												}
												onClick={(e) => {
													e.stopPropagation()
													setOpenSheet(false)
													setIsMapping(true)
													setUserEditingAddress(address)
													navigate('/edit-address/${from}')
												}}>
												<Icon icon="zi-edit-text" size={16} />
											</Button>
										}
									/>
								)
							})}
						</List>
					}
					<Button
						className={`h-10 m-8 px-0 py-2 w-10/12 border-l-0 border-b-0 rounded-full ml-auto mr-auto block`}
						onClick={async () => {
							setUserEditingAddress({
								id: 0,
								name: authDt?.profile?.name,
								phone: authDt?.profile?.phone,
								email: authDt?.profile?.email,
								address: '',
								notes: '',
								default: false,
							})
							setIsMapping(true)
							setOpenSheet(false)
							navigate(`/edit-address/${from}`)
						}}>
						<Icon icon="zi-plus-circle" size={23} /> {`Thêm địa chỉ`}
					</Button>
				</div>
			</Sheet>
		)
	)
}

export default AddressesPicker
