import {Box, Button, Text, useNavigate} from "zmp-ui";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
    cartState,
    selectedCouponState,
    selectedPaymentMethodState,
    shippingAddressState,
    shippingDateState,
    userOrdersState
} from "../states/cart";
import { convertPrice } from "../utils";
import React, { useEffect } from "react";
import {branchTypeState, branchValState, currenTabState, headerState, pageGlobalState} from "../state";
import { Address, CartData, Coupon, Order, PaymentMethod, ShippingDate } from "../models";
import moment from "moment";
import { authState } from "../states/auth";
import { resetCartCache, saveOrderToCache } from "../services/storage";
import { createMac } from "../services/zalo";
import { Payment } from "zmp-sdk";

const CheckoutNav = () => {
    const navigate = useNavigate();
    const setErrMsg = useSetRecoilState(pageGlobalState);

    const { showTotalCart, showBottomBar } = useRecoilValue(headerState);
    const authDt = useRecoilValue(authState);
    const [cart, setCart] = useRecoilState<CartData>(
        cartState
    );

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useRecoilState<PaymentMethod>(
        selectedPaymentMethodState
    );
    const [selectedCoupon, setSelectedCoupon] = useRecoilState<Coupon>(
        selectedCouponState
    );
    const [userOrders, setUserOrders] = useRecoilState<Order[]>(
        userOrdersState
    );
    const [shippingDate, setShippingDate] = useRecoilState<ShippingDate>(
        shippingDateState
    );
    const [shippingAddress, setShippingAddress] = useRecoilState<Address>(
        shippingAddressState
    );
    const [branchType, setBranchType] = useRecoilState<number>(
        branchTypeState
    );
    const [branchVal, setBranchVal] = useRecoilState<number>(
        branchValState
    );

    const [currenTab, setCurrentTab] = useRecoilState<string>(
        currenTabState
    );
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

    //const location = useLocation();




    const check =  () => {
        const checkItem = cart?.cartItems?.length > 0;
        let checkBranch = false
            switch(currenTab) {
                case 'giao_hang_tan_noi':
                    checkBranch = !!((shippingAddress && shippingAddress.id > 0) && branchVal && branchType === 1);
                    break;
                case 'tai_cua_hang':
                    checkBranch = !!(shippingDate.date !== "" && branchVal && branchType === 2);
                    break;
                default:
                    checkBranch = false;
            }
            const checkPayment = !!selectedPaymentMethod && selectedPaymentMethod?.id > 0;


        return !(checkItem && checkBranch && checkPayment)


    }


    return ( !!(cart && cart?.cartItems && cart?.cartItems?.length > 0 && showTotalCart)) ? (<div className={`w-full fixed ${showBottomBar ? `bottom-[55px]` : `bottom-0`} left-0 shadow-btn-fixed`}>
        <div className="flex bg-white p-4 items-start justify-between">
            <Box  className="w-1/2">
                    <Text size="xxxSmall"  className={'w-full'} >{cart.cartItems.length} Món ăn</Text>
                    <Text size="xLarge" className={`font-semibold`}>{`${convertPrice(Number(cart?.totalCart || 0) + (cart?.deliveryFee || 0))} đ`}</Text>
            </Box>

            <Button
                className="w-full text-white"
                variant={((shippingAddress && shippingAddress.id > 0 || shippingDate) && branchVal && selectedPaymentMethod && selectedPaymentMethod.id > 0) ? `primary` : `secondary`}
                size="large"
                onClick={async () => {
                    if ((shippingAddress && shippingAddress.id > 0 || shippingDate) && branchVal && selectedPaymentMethod && selectedPaymentMethod?.id > 0) {
                        const lineItems = cart?.cartItems.map((cartItem, cartIndex) => {
                            const price = cartItem?.sale_price > 0 ? cartItem?.sale_price : cartItem?.price;
                            return {
                                id: cartItem?.product_id,
                                parent: cartItem?.parent,
                                name: cartItem?.name,
                                quantity: cartItem?.quantity,
                                subtotal: price * cartItem?.quantity,
                                price: price,
                                image: cartItem?.image,
                                user_note: cartItem?.user_note
                            }
                        });
                        let maxId = 0;
                        if (userOrders && userOrders?.length > 0) {
                            maxId = userOrders?.reduce((acc, value) => {
                                return (acc = acc > value.id ? acc : value.id);
                            }, 0) || 0;
                        }

                        const newOrder = {
                            id: maxId + 1,
                            parent_id: 0,
                            status: "processing",
                            currency: "VND",
                            version: "1.0",
                            prices_include_tax: true,
                            date_created: moment().format("h:mm DD/MM/YYYY"),
                            date_modified: moment().format("h:mm DD/MM/YYYY"),
                            discount_total: (selectedCoupon && selectedCoupon?.code && selectedCoupon?.amount) ? (parseInt(selectedCoupon?.discount_type || '0') == 1 ? Number(selectedCoupon?.amount || 0) * cart?.totalCart / 100 : Number(selectedCoupon?.amount || 0)) : 0,
                            shipping_total: 0,
                            total: parseFloat(cart?.totalCart + '' || '0'),
                            customer_id: authDt?.profile?.id || '',
                            shipping: shippingAddress,
                            payment_method: selectedPaymentMethod?.id,
                            payment_method_title: selectedPaymentMethod?.title,
                            created_via: "zalo",
                            date_completed: moment().format("h:mm DD/MM/YYYY"),
                            branch_id: branchVal,
                            branch_type: branchType,
                            line_items: lineItems
                        };
                        saveOrderToCache(newOrder);
                        setUserOrders(old => {
                            let orders = (old && old?.length > 0) ? [...old] : [];
                            orders.push(newOrder as Order)
                            return orders;
                        });

                        // setErrMsg(oldMsg => {
                        //     return {
                        //         ...oldMsg,
                        //         errMsg: "Tạo đơn hàng thành công!"
                        //     }
                        // })
                        // resetCartCache();
                        // setCart({
                        //     cartItems: [],
                        //     totalCart: 0,
                        //     totalCheckout: 0,
                        //     isFetching: false
                        // })
                        // setBranchVal(0); setBranchType(0); setShippingAddress(null); setShippingDate(null); setSelectedCoupon(null); setSelectedPaymentMethod(null);
                        //tạo đơn hàng

                        const item = lineItems.map((i) => (
                            {
                                id: i.id,
                                amount: i.subtotal
                            }
                        ));

                        const paymentMethod = {
                            id: selectedPaymentMethod.code,
                            isCustom: false
                        }

                        const extraData = {
                            orderId: newOrder.id
                        }

                        const totalAmount = item.reduce((acc, curentItem) => acc + curentItem.amount, 0)

                        let orderData = {
                            desc: `Thanh toan ${totalAmount}`,
                            item,
                            amount: totalAmount,
                            extradata: JSON.stringify(extraData),
                            method: JSON.stringify(paymentMethod)

                        }

                        const getMac = await createMac(orderData)
                        if (getMac) {
                            orderData.mac = getMac.mac
                            new Promise((resolve, reject) => {
                                Payment.createOrder({
                                    ...orderData,
                                    success: async (data) => {
                                        const { orderId } = data;

                                        resolve(orderId)
                                        resetCartCache();
                                        setCart({
                                            cartItems: [],
                                            totalCart: 0,
                                            totalCheckout: 0,
                                            isFetching: false
                                        })
                                        setBranchVal(0); setBranchType(0); setShippingAddress(null); setShippingDate(null); setSelectedCoupon(null);
                                        navigate(`/my-orders`);
                                    },
                                    fail: (e) => {
                                        console.error(e)
                                        reject(e)
                                    }
                                })
                            })
                        } else {
                            console.log('Không thể tạo MAC')
                        }
                        //
                    } else {
                        navigate(`/cart`);
                    }
                }}
                disabled={check()}            >
                Mua hàng
            </Button>
        </div>
    </div>) : <></>
}
export default CheckoutNav;
