import React, {useEffect, useState} from "react";
import useSetHeader from "../../hooks/useSetHeader";
import {Box, Picker, Tabs, Text, useNavigate} from "zmp-ui";
import {HiLocationMarker, HiMap, HiOutlineArrowRight, HiOutlineClock} from 'react-icons/hi';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    cartState,
    selectedCouponState,
    selectedPaymentMethodState,
    shippingAddressState,
    shippingDateState
} from "../../states/cart";
import {convertPrice} from "../../utils";
import {Address, Branch, Coupon, PaymentMethod, Product, ProductInfoPicked, ShippingDate} from "../../models";
import {useAddProductToCart} from "../../hooks";
import {
    branchLatState,
    branchLngState,
    branchPointState,
    branchTypeState,
    branchValState,
    openCouponPickerState,
    openPaymentMethodPickerState,
    openProductPickerState,
    openProductsPickerState,
    openStoresPickerState,
    pageGlobalState,
    productInfoPickedState, userEditingAddressState
} from "../../state";
import Container from "../../components/layout/Container";
import {branchsState, couponsState, homeProductsState} from "../../states/home";
import ArrowObject from "../../components/checkout/arrow-object";
import moment from 'moment'
import {VIET_MAP_KEY} from "../../utils/constants";
import {VietmapApi} from "@vietmap/vietmap-api";

const UserCart = () => {
    const navigate = useNavigate();
    const cart = useRecoilValue(cartState);
    const [distance, setDistance] = useState< number | null>(null);
    const [buyDate,setBuyDate] = useState('');
    const [buyHour,setBuyHour] = useState(0);
    const [buyMinute,setBuyMinute] = useState(0);
    const addProductToCart = useAddProductToCart();
    const setErrMsg = useSetRecoilState(pageGlobalState);
    const coupons = useRecoilValue<Coupon[]>(couponsState);
    const selectedCoupon = useRecoilValue<Coupon>(selectedCouponState);
    const setHeader = useSetHeader();
    const setProductInfoPicked = useSetRecoilState(productInfoPickedState);
    const setOpenSheet = useSetRecoilState(openProductPickerState);
    const products = useRecoilValue<Product[]>(homeProductsState);
    const setOpenProductsSheet = useSetRecoilState(openProductsPickerState);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useRecoilState<PaymentMethod>(
        selectedPaymentMethodState
    );
    const [shippingAddress, setShippingAddress] = useRecoilState<Address>(
        shippingAddressState
    );
    const [shippingDate, setShippingDate] = useRecoilState<ShippingDate>(
        shippingDateState
    );

    const [openStoreSheet, setOpenStoreSheet] = useRecoilState<boolean>(
        openStoresPickerState
    );
    const [openCouponSheet, setOpenCouponSheet] = useRecoilState<boolean>(
        openCouponPickerState
    );
    const [openPaymentMethodSheet, setOpenPaymentMethodSheet] = useRecoilState<boolean>(
        openPaymentMethodPickerState
    );

    const [branchVal, setBranchVal] = useRecoilState<number>(
        branchValState
    );
    const [branchType, setBranchType] = useRecoilState<number>(
        branchTypeState
    );

    const [branchLat, setBranchLat] = useRecoilState<number>(
        branchLatState
    );

    const [branchLng, setBranchLng] = useRecoilState<number>(
        branchLngState
    );


    console.log("branchPoint",branchLng,branchLat, shippingAddress )

    const vietmapApi = new VietmapApi({ apiKey: VIET_MAP_KEY })
    const getDistance = async () => {
        const distance = await vietmapApi.route(
            [[branchLat,branchLng], [shippingAddress.lat,shippingAddress.lng]],
            ({ vehicle: 'motorcycle',apikey: VIET_MAP_KEY,points_encoded: true, optimize:true}),
        )
        setDistance(distance.paths[0].distance)
        console.log(distance, 'distance')
    }

    useEffect(() => {
        if(branchLat && branchLng && shippingAddress && shippingAddress?.lat && shippingAddress?.lng && branchLat > 0 && branchLng > 0){
            getDistance()
        }
    }, [branchLng,branchLat, shippingAddress ]);

    const branchs = useRecoilValue<Branch[]>(branchsState);
    useEffect(() => {
        setHeader({
            customTitle:  "Cart",
            hasLeftIcon: true,
            type: "secondary",
            showBottomBar: false,
            showTotalCart: true
        });
    }, []);
    const genHourData = () => {
        const data = [];
        for (let i = 0; i < 24; i++) {
          data.push({
            value: i,
            displayName: `${i<10 ? `0${i}` : i}`,
          });
        }
        return data;
      };
      const genMinuteData = () => {
        const data = [];
        for (let i = 0; i < 60; i++) {
          data.push({
            value: i,
            displayName: `${i<10 ? `0${i}` : i}`,
          });
        }
        return data;
      };
      const genDateData = () => {
        var now = new Date();
        var daysOfYear = [];
        var toDate = now.setDate(now.getDate()+ 1 * 7);
        for (var d = new Date(); d <= now; d.setDate(d.getDate() + 1)) {
            daysOfYear.push({
                value: moment(d).format("DD/MM/YYYY"),
                displayName: moment(d).format("DD/MM/YYYY")
            });
        }
        return daysOfYear;
      };
    useEffect(()=>{
        setShippingDate({
            date: buyDate,
            hour: buyHour,
            minute: buyMinute
        })
    },[buyDate,buyHour,buyMinute])
    return (<Container className={""}>
        <div className="container mx-auto pt-4  pb-48  zui-container-background-color">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-3/4">
                        <div className="w-full">
                            <div className={`px-4`}>
                                {(cart && cart?.cartItems) && <div className={"w-full bg-white rounded-lg mb-4 p-4 shadow-btn-fixed"}> <table  className="w-full"><tbody>
                            {cart?.cartItems?.filter(cItem => cItem.parent===0).map((cartItem,cartIndex) => {
                                const childItems = cart.cartItems?.filter(cIt => cIt.parent===cartItem.product_id);
                                let totalItemPrice = (parseFloat(cartItem.sale_price+'') > 0) ? cartItem.sale_price : cartItem.price;
                                if(childItems && childItems?.length > 0){
                                    childItems.map(child => {
                                        totalItemPrice += (parseFloat(child.sale_price+'') > 0) ? child.sale_price : child.price;
                                    })
                                }

                                return (<tr key={`cart_item${cartIndex}`} onClick={()=>{
                                    setProductInfoPicked(info => {
                                        return {
                                            ...info,
                                            product: products.find(cIt => cIt.id === cartItem.product_id),
                                            currentItem: cartItem
                                        } as ProductInfoPicked
                                    });
                                    setOpenSheet(true)
                                }}>
                                    <td className="py-4">
                                        <div className="flex items-start">
                                            <img className="w-[60px] h-[60px] mr-4 rounded-lg" src={`${cartItem.image}`}  alt={`${cartItem.name}`}/>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm zblack-color">{`${cartItem.name}`}</p>
                                                <p className="text-sm grey-price-color mt-1">{`${convertPrice(totalItemPrice)} đ`}</p>
                                                {(childItems && childItems?.length > 0) && <div className="text-xs grey-price-color mt-1"><span>{`Đồ ăn thêm: `}</span>{childItems?.map(chItem => {
                                                    return (<span>{chItem.name+', '}</span>)
                                                })}</div>}
                                            </div>
                                            <span className="text-sm text-center w-8 zaui-link-text-color">{`x ${cartItem.quantity}`}</span>
                                        </div>
                                    </td>
                                </tr>)
                            })}

                            </tbody></table></div>}
                                <div className={`text-right`}><Text size={`xSmall`} className={`zaui-link-text-color font-semibold`} onClick={()=>{
                                    setOpenProductsSheet(true);
                                }}>Thêm món</Text></div>
                            </div>
                            <Box mt={4} className={`px-4 `}>
                                <div className={`w-full bg-white rounded-lg p-4`}>
                                    <Text bold size={'large'} className={`mb-2`}>{`Tổng cộng`}</Text>
                                    <div className={`flex w-full border-gray-300 border-b py-6`}>
                                        <Text className={`flex-1`}>{`Thành tiền`}</Text>
                                        <Text>{`${convertPrice(Number(cart?.totalCart || 0))} đ`}</Text>
                                    </div>
                                    <div className={`flex w-full border-gray-300 border-b py-6`}>
                                        <Text className={`flex-1`}>{`Mã giảm giá`}</Text>
                                        <Text>{(selectedCoupon && selectedCoupon?.code) ? (parseInt(selectedCoupon?.discount_type || '0') !== 1 ? `${convertPrice(Number(selectedCoupon?.amount || 0))} đ` : `${convertPrice(Number(selectedCoupon?.amount || 0) * cart?.totalCart/100 )} đ`) : ''}</Text>
                                    </div>
                                    <div className={`flex w-full border-gray-300 border-b py-6 justify-between`}>
                                        <div>
                                            <Text >{`Phí giao hàng`}</Text>
                                            { distance &&   <Text className={'pt-1 text-gray-600'} size={'xxSmall'}>{`${distance/1000} km`}</Text>}

                                        </div>
                                        <Text>{`${convertPrice(Number( 0))} đ`}</Text>
                                    </div>
                                    <div className={`flex w-full  pt-6`}>
                                        <Text size={'large'}  className={`flex-1 font-extrabold`}>{`Số tiền thanh toán`}</Text>
                                        <Text size={'large'}  className={`font-extrabold`}>{`${convertPrice(Number(cart?.totalCart || 0))} đ`}</Text>
                                    </div>
                                </div>
                            </Box>
                            <Box mt={4} className={`px-4 `}>
                                <div className={`w-full bg-white rounded-lg p-4`}>
                                    <Tabs id="contact-list" onChange={(activeKey)=>{
                                    }}>
                                        <Tabs.Tab key="giao_hang_tan_noi" label="Giao hàng tận nơi">
                                            <ArrowObject icon={<HiMap className="mr-2 h-5 w-5 inline-block" />}  title={`Vị trí cửa hàng`} padding={0} textSize={"large"} content={(branchVal > 0 && branchType == 1) ? branchs.find(bit => (bit.id === branchVal))?.name : ``} subcontent={(branchVal > 0 && branchType == 1) ? branchs.find(bit => (bit.id === branchVal))?.address : ``} contentTextColor={`text-sky-500`} onClick={()=>{
                                                setBranchType(1);
                                                setOpenStoreSheet(true);
                                            }} rightcontent={''} extraClassName={`w-full bg-white rounded-lg p-4`}></ArrowObject>
                                            <ArrowObject icon={<HiLocationMarker className="mr-2 h-5 w-5 inline-block" />}  title={`Địa chỉ`} padding={0} textSize={"large"} content={(shippingAddress && shippingAddress?.id) ? shippingAddress.name+' - ' +shippingAddress.phone : ``} subcontent={(shippingAddress && shippingAddress?.id) ? shippingAddress.address : ``} contentTextColor={`text-sky-500`} onClick={()=>{
                                                navigate('/my-addresses/cart');
                                            }} rightcontent={''} extraClassName={`w-full bg-white rounded-lg p-4`}></ArrowObject>
                                        </Tabs.Tab>
                                        <Tabs.Tab key="tai_cua_hang" label="Lấy tại cửa hàng">
                                            <ArrowObject icon={<HiMap className="mr-2 h-5 w-5 inline-block" />}  title={`Vị trí cửa hàng`} padding={0} textSize={"large"} content={(branchVal > 0 && branchType == 2) ? branchs.find(bit => (bit.id === branchVal))?.name : ``} subcontent={(branchVal > 0 && branchType == 2) ? branchs.find(bit => (bit.id === branchVal))?.address : ``}  contentTextColor={`text-sky-500`} onClick={()=>{
                                                setBranchType(2);
                                                setOpenStoreSheet(true);
                                            }} rightcontent={''} extraClassName={`w-full bg-white rounded-lg p-4`}></ArrowObject>

                                           <div className="p-4 ">
                                           <Picker
                                                placeholder="Chọn thời gian"
                                                prefix={<HiOutlineClock className="mr-2 h-5 w-5 inline-block" />}
                                                suffix={<HiOutlineArrowRight className="ml-2 h-4 w-4 " />}
                                                mask
                                                maskClosable
                                                inputClass="border-none bg-transparent text-base text-black font-medium text-md m-0 p-0 h-auto"
                                                action={{
                                                text: "Đóng",
                                                close: true,
                                                }}

                                                formatPickedValueDisplay={(test) =>
                                                    (test && test?.hour && test?.minute && test?.date)
                                                      ? `${test?.hour?.displayName} : ${test?.minute?.displayName} - ${test?.date?.displayName}`
                                                      : `Chọn thời gian`
                                                  }

                                                data={[
                                                {
                                                    options: genHourData(),
                                                    name: "hour",
                                                },
                                                {
                                                    options: genMinuteData(),
                                                    name: "minute",
                                                },
                                                {
                                                    options: genDateData(),
                                                    name: "date",
                                                },
                                                ]}

                                                onChange={(value)=>{
                                                    if(!value?.date || !value?.hour || !value?.minute){
                                                        setErrMsg(oldMsg => {
                                                            return {
                                                              ...oldMsg,
                                                              errMsg: "Bạn cần chọn đủ thời gian nhận hàng"
                                                            }
                                                          })
                                                    }else{
                                                       /**/
                                                        setBuyHour(value.hour.value);
                                                        setBuyMinute(value.minute.value);
                                                        setBuyDate(value.date.value);
                                                        console.log("me kiep val ",value)
                                                    }
                                                }}
                                            />
                                           </div>
                                        </Tabs.Tab>
                                    </Tabs>
                                </div>
                            </Box>
                            {(!cart || !cart?.cartItems?.length) && <div className={'py-8 px-4'}><Text>{`Không có sản phẩm nào trong giỏ hàng`}</Text></div>}
                            <Box mt={4} className={`px-4 `}>
                                <ArrowObject  title={`Mã giảm giá`} padding={0} textSize={"large"} content={(selectedCoupon && selectedCoupon?.code) ? selectedCoupon.description : ``} subcontent={(selectedCoupon && selectedCoupon?.code) ? (parseInt(selectedCoupon?.discount_type || '0') !== 1 ? `${convertPrice(Number(selectedCoupon?.amount || 0))} đ` : `${convertPrice(Number(selectedCoupon?.amount || 0) * cart?.totalCart/100 )} đ`) : ''} contentTextColor={`text-sky-500`} onClick={()=>{
                                   setOpenCouponSheet(true)
                                }} rightcontent={''} extraClassName={`w-full bg-white rounded-lg p-4`}></ArrowObject>
                                {/*coupons && <Coupons coupons={coupons}/>*/}
                            </Box>
                            <Box mt={4} className={`px-4 `}>
                                <ArrowObject  title={`Phương thức thanh toán`} padding={0} textSize={"large"} content={(selectedPaymentMethod && selectedPaymentMethod?.id) ? selectedPaymentMethod.title : ``} contentTextColor={`text-sky-500`} onClick={()=>{
                                   //setSelectedPaymentMethod(true)
                                   setOpenPaymentMethodSheet(true)
                                }} rightcontent={''} subcontent={(selectedPaymentMethod?.notes) ? selectedPaymentMethod?.notes: ''} extraClassName={`w-full bg-white rounded-lg p-4`}></ArrowObject>
                            </Box>
                        </div>
                </div>

            </div>
        </div>
   </Container>);
}
export default UserCart;
