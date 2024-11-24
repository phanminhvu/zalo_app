import React from 'react'
import { useNavigate } from 'zmp-ui'
import { openChat } from 'zmp-sdk/apis'
import { openWebview } from 'zmp-sdk/apis'
import {
	HiOutlineChat,
	HiOutlineHome,
	HiOutlineNewspaper,
	HiOutlineShoppingCart,
	HiOutlineUser,
} from 'react-icons/hi'
import { useRecoilValue } from 'recoil'
import { headerState } from '../state'
import { cartState } from '../states/cart'
import { ZALO_OA_ID } from '../utils/constants'
import { openSheetChatState } from '../state'
import { useRecoilState } from 'recoil'
const BottomNav = () => {
	const [openSheetChat, setOpenSheetchat] = useRecoilState<boolean>(openSheetChatState)
	const navigate = useNavigate()
	const { route, hasLeftIcon, rightIcon, title, customTitle, type, showBottomBar } =
		useRecoilValue(headerState)
	const cart = useRecoilValue(cartState)
	return showBottomBar ? (
		<section id="bottom-navigation" className="block fixed inset-x-0 bottom-0 z-10 bg-white shadow">
			<div id="tabs" className="flex justify-between">
				<a
					onClick={() => {
						navigate('/')
					}}
					className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
					<HiOutlineHome className="mr-2 h-5 w-5 inline-block mb-1" />
					<span className="tab tab-home block text-xs">Trang chủ</span>
				</a>
				<a
					onClick={() => {
						navigate('/cart')
					}}
					className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 relative">
					<div className="relative inline-block">
						<HiOutlineShoppingCart className="mr-2 h-5 w-5 inline-block mb-1" />
						{cart && cart?.cartItems && cart?.cartItems?.length > 0 && (
							<span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
								{cart?.cartItems?.filter((cItem) => cItem.parent == 0)?.length || 0}
							</span>
						)}
					</div>
					<span className="tab tab-explore block text-xs">Giỏ hàng</span>
				</a>
				<a
					onClick={() => {
						// setOpenSheetchat(true);
						//navigate('/affiliate');
						openChat({
							type: 'oa',
							id: ZALO_OA_ID,
							message: 'Xin Chào',
							success: () => {},
							fail: (err) => {},
						})
					}}
					className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
					<HiOutlineChat className="mr-2 h-5 w-5 inline-block mb-1" />

					<span className="tab tab-explore block text-xs">Chat</span>
				</a>
				<a
					onClick={() => {
						// openWebview({
						//     url: "https://nemnuongquequan.com/blogs/news",
						//     config: {
						//         style: "normal",
						//         leftButton: "back"
						//     },
						//     success: (res) => {
						//         // xử lý khi gọi api thành công
						//     },
						//     fail: (error) => {
						//         // xử lý khi gọi api thất bại
						//         console.log(error);
						//     }
						// });

						navigate('/news-page')
					}}
					className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
					<HiOutlineNewspaper className="mr-2 h-5 w-5 inline-block mb-1" />
					<span className="tab tab-kategori block text-xs">Tin tức</span>
				</a>
				<a
					onClick={() => {
						navigate('/my-profile')
					}}
					className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
					<HiOutlineUser className="mr-2 h-5 w-5 inline-block mb-1" />
					<span className="tab tab-whishlist block text-xs">Tài khoản</span>
				</a>
			</div>
		</section>
	) : null
}
export default BottomNav
