import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil'
import React, { useRef } from 'react'
import { Box, Text, Sheet, List, Icon, Radio } from 'zmp-ui'
import { openSheetChatState } from '../state'
import { openChat } from 'zmp-sdk/apis'
const { Item } = List
const SheetChat = () => {
	const [openSheetChat, setOpenSheetchat] = useRecoilState<boolean>(openSheetChatState)
	const sheet = useRef<any>(null)

	const openChatScreen = async (id: string) => {
		try {
			await openChat({
				type: 'user',
				id: 'user-id',
				message: 'Xin Chào',
			})
		} catch (error) {
			// xử lý khi gọi api thất bại
			console.log(error)
		}
	}

	// console.log("branchs",branchs)
	return (
		<Sheet
			mask
			visible={openSheetChat}
			swipeToClose
			maskClosable
			onClose={() => setOpenSheetchat(false)}
			ref={sheet}
			autoHeight
			title='Cần hỗ trợ'>
			<div className='w-full mt-3 bg-blue-100 '>
				<Text className={'text-center pl-4 pr-4 pt-3 pb-3'}>Chăm Sóc Khách Hàng</Text>
			</div>
			<div className='overflow-y-auto max-h-full'>
				<List>
					{/*zi-check-circle*/}
					<Item
						key='0'
						title='CSKH - Thảo Điền'
						onClick={() => {
							openChatScreen('6465140566074194111')
							setOpenSheetchat(false)
						}}
					/>
					<Item
						key='1'
						title='CSKH - Quận 7'
						onClick={() => {
							setOpenSheetchat(false)
						}}
					/>
					<Item
						key='2'
						title='CSKH - Tân Bình'
						onClick={() => {
							setOpenSheetchat(false)
						}}
					/>
					<Item
						key='3'
						title='CSKH - Thủ Đức'
						onClick={() => {
							setOpenSheetchat(false)
						}}
					/>
					<Item
						key='4'
						title='CSKH - Quận 1'
						onClick={() => {
							setOpenSheetchat(false)
						}}
					/>
					<Item
						key='5'
						title='CSKH - Gò Vấp'
						onClick={() => {
							setOpenSheetchat(false)
						}}
					/>
				</List>
			</div>
		</Sheet>
	)
}
export default SheetChat
