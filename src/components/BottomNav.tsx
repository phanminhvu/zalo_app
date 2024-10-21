import React from "react";
import {useNavigate} from "zmp-ui";
import {openChat} from 'zmp-sdk/apis';

import {HiOutlineChat, HiOutlineHome, HiOutlineNewspaper, HiOutlineShoppingCart, HiOutlineUser} from 'react-icons/hi';
import {useRecoilValue} from "recoil";
import {headerState} from "../state";
import {cartState} from "../states/cart";
import {ZALO_OA_ID} from "../utils/constants";

const BottomNav = () => {
    const navigate = useNavigate();
    const { route, hasLeftIcon, rightIcon, title, customTitle, type, showBottomBar } =
        useRecoilValue(headerState);
    const cart = useRecoilValue(cartState);
    return showBottomBar ? (<section id="bottom-navigation" className="block fixed inset-x-0 bottom-0 z-10 bg-white shadow">
    <div id="tabs" className="flex justify-between">
        <a onClick={()=>{
            navigate('/');
        }}
           className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <HiOutlineHome className="mr-2 h-5 w-5 inline-block mb-1" />
            <span className="tab tab-home block text-xs">Trang chủ</span>
        </a>
        <a onClick={()=>{
            navigate('/cart');
        }}
           className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1 relative">
            <HiOutlineShoppingCart className="mr-2 h-5 w-5 inline-block mb-1" />
            <span className="tab tab-explore block text-xs">Giỏ hàng</span>
            {(cart && cart?.cartItems && cart?.cartItems?.length > 0) && <span className={"badge"}>{cart?.cartItems?.filter(cItem => cItem.parent == 0)?.length || 0}</span>}
        </a>
        <a onClick={()=>{
            //navigate('/affiliate');
            openChat({
                type: 'oa',
                id: ZALO_OA_ID,
                message: 'Xin Chào',
                success: () => {},
                fail: (err) => {}
            });
        }}
           className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <HiOutlineChat className="mr-2 h-5 w-5 inline-block mb-1" />

            <span className="tab tab-explore block text-xs">Chat</span>
        </a>
        <a onClick={()=>{
            navigate('/news-page');
        }}
           className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <HiOutlineNewspaper className="mr-2 h-5 w-5 inline-block mb-1" />
            <span className="tab tab-kategori block text-xs">Tin tức</span>
        </a>
        <a onClick={()=>{
            navigate('/my-profile');
        }}
           className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <HiOutlineUser className="mr-2 h-5 w-5 inline-block mb-1" />
            <span className="tab tab-whishlist block text-xs">Tài khoản</span>
        </a>

    </div>
</section>) : (null)
}
export default BottomNav;
