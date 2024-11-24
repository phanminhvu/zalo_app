import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil'
import {
	pageGlobalState,
	openStoresPickerState,
	branchValState,
	branchTypeState,
	branchPointState,
	branchLatState,
	branchLngState,
} from '../state'
import React, { useRef } from 'react'
import { branchsState } from '../states/home'
import { Box, Text, Sheet, List, Icon, Radio } from 'zmp-ui'
import CardProductVertical from './custom-card/product-vertical'
import { Branch } from '../models'

const { Item } = List
const StoresPicker = () => {
	const setErrMsg = useSetRecoilState(pageGlobalState)
	const [openSheet, setOpenSheet] = useRecoilState<boolean>(openStoresPickerState)
	const [branchVal, setBranchVal] = useRecoilState<number>(branchValState)

	const [branchLat, setBranchLat] = useRecoilState<number>(branchLatState)

	const [branchLng, setBranchLng] = useRecoilState<number>(branchLngState)
	const [branchType, setBranchType] = useRecoilState<number>(branchTypeState)
	const branchs = useRecoilValue<Branch[]>(branchsState)
	const sheet = useRef<any>(null)

	// console.log("branchs",branchs)
	return (
		<>
			{branchs && (
				<Sheet
					mask
					visible={openSheet}
					swipeToClose
					maskClosable
					onClose={() => setOpenSheet(false)}
					ref={sheet}
					autoHeight
					title="Vị trí cửa hàng">
					<div className="w-full mt-3 bg-blue-100 ">
						<Text className={'text-center pl-4 pr-4 pt-3 pb-3'}>
							Vui lòng chọn vị trí cửa hàng phù hợp cho đơn hàng của bạn
						</Text>
					</div>
					<div className="overflow-y-auto max-h-full">
						<List>
							{/*zi-check-circle*/}
							{branchs &&
								branchs.map((branch) => (
									<Item
										key={branch.id}
										title={branch.name}
										onClick={() => {
											setBranchLat(branch.lat)
											setBranchLng(branch.lng)
											setBranchVal(branch.id)
											setOpenSheet(false)
										}}
										subTitle={branch.address}
										prefix={
											<Radio size={'small'} className={'mt-3'} checked={branchVal === branch.id} />
										}
									/>
								))}
						</List>
					</div>
				</Sheet>
			)}
		</>
	)
}
export default StoresPicker
