import React, {useEffect, useState} from "react";
import useSetHeader from "../../hooks/useSetHeader";
import {Box, Picker, Tabs, Text, useNavigate, Page, List, Icon, Button, Input} from "zmp-ui";
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
import {Address, Branch, CartData, Coupon, PaymentMethod, Product, ProductInfoPicked, ShippingDate} from "../../models";
import {useAddProductToCart} from "../../hooks";
import {
    branchLatState,
    branchLngState,
    //branchPointState,
    branchTypeState,
    branchValState, openAddressPickerState,
    openCouponPickerState,
    openPaymentMethodPickerState,
    openProductPickerState,
    openProductsPickerState,
    openStoresPickerState,
    pageGlobalState,
    productInfoPickedState, userAddressesState, userEditingAddressState
} from "../../state";
import Container from "../../components/layout/Container";
import {branchsState, couponsState, homeProductsState} from "../../states/home";
import ArrowObject from "../../components/checkout/arrow-object";
import moment from 'moment'
import {VIET_MAP_KEY} from "../../utils/constants";
import {VietmapApi} from "@vietmap/vietmap-api";
import cod from "../../components/buy.png";
import bank from "../../components/bank.png";

const UserCart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useRecoilState<CartData>(
        cartState
    );
    const [distance, setDistance] = useState<number >(0);
    const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
    console.log('distance', distance)
    useEffect(() => {
            setDeliveryFee(phiGiaohang(distance / 1000));
            setCart({
                ...cart,
                deliveryFee: phiGiaohang(distance / 1000)
            })
    }, [distance])
    const [currenTab, setCurrentTab] = useState("giao_hang_tan_noi");
    const [buyDate, setBuyDate] = useState('');
    const [buyHour, setBuyHour] = useState(0);
    const [buyMinute, setBuyMinute] = useState(0);
    const addProductToCart = useAddProductToCart();
    const setErrMsg = useSetRecoilState(pageGlobalState);
    const coupons = useRecoilValue<Coupon[]>(couponsState);
    const selectedCoupon = useRecoilValue<Coupon>(selectedCouponState);
    const setHeader = useSetHeader();
    const setProductInfoPicked = useSetRecoilState(productInfoPickedState);
    const setOpenSheet = useSetRecoilState(openProductPickerState);
    const products = useRecoilValue<Product[]>(homeProductsState);
    const setOpenProductsSheet = useSetRecoilState(openProductsPickerState);
    const [openAddressSSheet, setOpenAddressSheet] = useRecoilState<boolean>(
        openAddressPickerState
    );

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useRecoilState<PaymentMethod>(
        selectedPaymentMethodState
    );

    const [userAddresses, setUserAddresses] = useRecoilState<Address[]>(
        userAddressesState
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

    console.log(Object.keys(shippingAddress).length === 0);


    console.log(shippingAddress == {})
    useEffect(() => {
        if(Object.keys(shippingAddress).length === 0){
            console.log('alo')
            if(userAddresses.filter(data => data.default).length > 0){
                console.log('userAddresses', userAddresses.filter(data => data.default)[0])
                setShippingAddress(userAddresses.filter(data => data.default)[0])
            }
        }
    }, []);

    const vietmapApi = new VietmapApi({apiKey: VIET_MAP_KEY})
    const getDistance = async () => {
        const distance = await vietmapApi.route(
            [[branchLat, branchLng], [shippingAddress.lat as number, shippingAddress.lng as number]],
            ({vehicle: 'motorcycle', apikey: VIET_MAP_KEY, points_encoded: true, optimize: true}),
        )
        setDistance(distance.paths[0].distance)
        // if(distance && distance > 0) {
        //     setDeliveryFee(phiGiaohang(distance /1000));
        // }
    }



    useEffect(() => {
        if ( branchType === 1 && branchLat && branchLng && shippingAddress && shippingAddress?.lat && shippingAddress?.lng && branchLat > 0 && branchLng > 0 && currenTab == "giao_hang_tan_noi") {
            getDistance()
        }
        if (currenTab == "tai_cua_hang" ) {
            setDistance(0)
        }
        if (branchType !== 1 ) {
            setDistance(0)
        }
    }, [branchLng, branchLat, shippingAddress , currenTab, branchType]);

    const branchs = useRecoilValue<Branch[]>(branchsState);
    useEffect(() => {
        setHeader({
            customTitle: "Giỏ hàng",
            hasLeftIcon: true,
            type: "secondary",
            showBottomBar: false,
            showTotalCart: true
        });
    }, []);

    function generateDateListFromToday(days: number): string[] {
        let dateList: string[] = [];
        let today = new Date();
        for (let i = 0; i < days; i++) {
            if (today.getHours() < 22 || i != 0) {
                let currentDate = new Date(today);
                currentDate.setDate(today.getDate() + i); // Tăng ngày thêm i ngày
                dateList.push(currentDate.toISOString().split('T')[0]); // Chuyển đổi thành định dạng YYYY-MM-DD
            }
        }
        return dateList;
    }


    const genHourData = (i: number) => {
        let now = new Date();
        let currentHour = i == 1 ? now.getHours() : 0; // Lấy số giờ hiện tại (0-23)
        currentHour = currentHour < 9 ? 9 : currentHour;
        const data: { value: number, displayName: string }[] = [];
        for (let i = currentHour; i < 22; i++) {
            data.push({
                value: i,
                displayName: `${i < 10 ? `0${i}` : i}`,
            });
        }
        return data;
    };
    const [genHourDataState, setgenHourDataState] = useState(genHourData(1));
    const getImageSource = (code: string) => {
        let source = ''
        switch (code) {
            case 'COD':
                source = cod
                break;
            case 'BANK':
                source = bank
                break;
        }
        return source
    }
    const genMinuteData = () => {
        const data: { value: number, displayName: string }[] = [];
        for (let i = 0; i < 60; i = i + 15) {
            data.push({
                value: i,
                displayName: `${i < 10 ? `0${i}` : i}`,
            });
        }
        return data;
    };
    const genDateData = () => {
        let listDate = generateDateListFromToday(3);
        let daysOfYear: { value: string, displayName: string }[] = [];
        let today = new Date();
        if (today.getHours() < 22) {
            listDate.forEach((element, i) => {
                daysOfYear.push({
                    value: moment(element).format("DD/MM/YYYY"),
                    displayName: i == 0 ? "Hôm nay" : moment(element).format("DD/MM/YYYY")
                });
            });
        } else {
            listDate.forEach((element, i) => {
                daysOfYear.push({
                    value: moment(element).format("DD/MM/YYYY"),
                    displayName: moment(element).format("DD/MM/YYYY")
                });
            });
        }
        return daysOfYear;
    };

    useEffect(() => {
        setShippingDate({
            date: buyDate,
            hour: buyHour,
            minute: buyMinute
        })
    }, [buyDate, buyHour, buyMinute])


    const phiGiaohang = (distance: number) => {

        // if (distance<= 2 ){
        //     return 20000;
        // }
        // else if (distance<= 3) {
        //     return 25000;
        // }
        // else if (distance<= 5) {
        //     return 30000;
        // }
        // else if (distance<= 7) {
        //     return 35000;
        // }
        // else if (distance<= 9) {
        //     return 45000;
        // }
        // else if (distance<= 11) {
        //     return 50000;
        // }
        // else return 300000;
        if (distance === 0) {
            return 0
        }else if (distance <= 3) {
            return 16000
        } else {
            return 16000 + (distance - 3) * 5500

        }
    }
    return (<Container className={""}>
        <div className="container mx-auto pt-4  pb-48  zui-container-background-color">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-3/4">
                    <div className="w-full">
                        <div className={`px-4`}>
                            {(cart && cart?.cartItems) ? <div
                                    className={"w-full bg-white items-center justify-center align-middle rounded-lg mb-4 p-4 shadow-btn-fix--ed"}>
                                    {
                                        cart?.cartItems?.filter(cItem => cItem.parent === 0).length > 0 ?
                                            <table className="w-full">
                                                <tbody>
                                                {cart?.cartItems?.filter(cItem => cItem.parent === 0).map((cartItem, cartIndex) => {
                                                    const childItems = cart.cartItems?.filter(cIt => cIt.parent === cartItem.product_id);
                                                    let totalItemPrice = (parseFloat(cartItem.sale_price + '') > 0) ? cartItem.sale_price : cartItem.price;
                                                    if (childItems && childItems?.length > 0) {
                                                        childItems.map(child => {
                                                            totalItemPrice += (parseFloat(child.sale_price + '') > 0) ? child.sale_price : child.price;
                                                        })
                                                    }

                                                    return (<tr key={`cart_item${cartIndex}`} onClick={() => {
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
                                                                <img className="w-[60px] h-[60px] mr-4 rounded-lg"
                                                                     src={`${cartItem.image}`} alt={`${cartItem.name}`}/>
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-sm zblack-color">{`${cartItem.name}`}</p>
                                                                    <p className="text-sm grey-price-color mt-1">{`${convertPrice(totalItemPrice)} đ`}</p>
                                                                    {(childItems && childItems?.length > 0) &&
                                                                        <div className="text-xs grey-price-color mt-1">
                                                                            <span>{`Đồ ăn thêm: `}</span>{childItems?.map(chItem => {
                                                                            return (<span>{chItem.name + ', '}</span>)
                                                                        })}</div>}
                                                                </div>
                                                                <span
                                                                    className="text-sm text-center w-8 zaui-link-text-color">{`x ${cartItem.quantity}`}</span>
                                                            </div>
                                                        </td>
                                                    </tr>)
                                                })}

                                                </tbody>
                                            </table> :
                                            <div className={"w-full items-center justify-center p-4"}>
                                                <Text size={`xxxSmall`} className="text-center">Không có món ăn, thức uống
                                                    trong giỏ hàng</Text>
                                            </div>
                                    }

                                </div> :
                                <div
                                    className={"w-full bg-white items-center justify-center align-middle rounded-lg mb-4 p-4 shadow-btn-fixed"}>
                                    <div className={"w-full items-center justify-center p-4"}>
                                        <Text size={`xxxSmall`} className="text-center">Không có món ăn, thức uống
                                            trong giỏ hàng</Text>
                                    </div>
                                </div>
                            }
                            <Text size={`xSmall`}
                                  style={{float: 'right'}}

                                  className={`zaui-link-text-color bg-[#088c4c] text-white rounded-3xl pt-1 pb-1 pl-3 pr-3  font-semibold`}
                                  onClick={() => {
                                      setOpenProductsSheet(true);
                                  }}>Thêm +</Text></div>

                        <Box mt={14} className={`px-4 mt-14`}>

                            <div className={`w-full bg-white rounded-lg p-4`}>

                                <Text bold size={'xLarge'} className={`mb-2`}>{`Tổng cộng`}</Text>

                                <List noSpacing>
                                    <List.Item
                                        title="Thành tiền"
                                        suffix={`${convertPrice(Number(cart?.totalCart || 0))} đ`}
                                    />
                                    <List.Item
                                        title="Mã giảm giá"
                                        suffix={(selectedCoupon && selectedCoupon?.code) ? (parseInt(selectedCoupon?.discount_type || '0') !== 1 ? `${convertPrice(Number(selectedCoupon?.amount || 0))} đ` : `${convertPrice(Number(selectedCoupon?.amount || 0) * cart?.totalCart / 100)} đ`) : ''}

                                    />
                                    <List.Item
                                        title="Phí giao hàng"
                                        suffix={`${convertPrice(Number(deliveryFee))} đ`}
                                        subTitle={`${(distance / 1000).toFixed(distance > 0 ? 2 : 0)} km`}
                                    />
                                    <List.Item
                                        title={<Text className={'font-bold'}>{`Số tiền thanh toán`}</Text>}
                                        suffix={`${convertPrice(Number((cart?.totalCart || 0) + (deliveryFee || 0)))} đ`}
                                        // subTitle={(distance && (distance / 1000).toFixed(2) + ' km')}
                                    />
                                </List>


                                {/*<div className={`flex w-full border-gray-300 border-b py-6`}>*/}
                                {/*    <Text className={`flex-1`}>{`Thành tiền`}</Text>*/}
                                {/*    <Text>{`${convertPrice(Number(cart?.totalCart || 0))} đ`}</Text>*/}
                                {/*</div>*/}
                                {/*<div className={`flex w-full border-gray-300 border-b py-6`}>*/}
                                {/*    <Text className={`flex-1`}>{`Mã giảm giá`}</Text>*/}
                                {/*    <Text>*/}
                                {/*        {(selectedCoupon && selectedCoupon?.code) ? (parseInt(selectedCoupon?.discount_type || '0') !== 1 ? `${convertPrice(Number(selectedCoupon?.amount || 0))} đ` : `${convertPrice(Number(selectedCoupon?.amount || 0) * cart?.totalCart / 100)} đ`) : ''}*/}
                                {/*    </Text>*/}
                                {/*</div>*/}
                                {/*<div className={`flex w-full border-gray-300 border-b py-6 justify-between`}>*/}
                                {/*    <div>*/}
                                {/*        <Text>{`Phí giao hàng`}</Text>*/}
                                {/*        {distance && <Text className={'pt-1 text-gray-600'}*/}
                                {/*                           size={'xxSmall'}>{`${(distance / 1000).toFixed(2)} km`}</Text>}*/}

                                {/*    </div>*/}
                                {/*    <Text>{`${convertPrice(Number(deliveryFee))} đ`}</Text>*/}
                                {/*</div>*/}
                                {/*<div className={`flex w-full  pt-6`}>*/}
                                {/*    <Text size={'large'}*/}
                                {/*          className={`flex-1 font-extrabold`}>{`Số tiền thanh toán`}</Text>*/}
                                {/*    <Text size={'large'}*/}
                                {/*          className={`font-extrabold`}>{`${convertPrice(Number((cart?.totalCart || 0) + (deliveryFee || 0)))} đ`}</Text>*/}
                                {/*</div>*/}
                            </div>
                        </Box>

                        <Box mt={4} className={`px-4 `}>
                            <div className={`w-full bg-white rounded-lg p-4`}>
                                <Tabs id="contact-list"

                                      activeKey={currenTab}
                                      onChange={(activeKey) => {
                                          setCurrentTab(activeKey)
                                }}>
                                    <Tabs.Tab key="giao_hang_tan_noi" label="Giao hàng tận nơi">
                                        {/*<ArrowObject icon={<HiMap className="mr-2 h-5 w-5 inline-block"/>}*/}
                                        {/*             title={`Vị trí cửa hàng`} padding={0} textSize={"large"}*/}
                                        {/*             content={(branchVal > 0 && branchType == 1) ? branchs.find(bit => (bit.id === branchVal))?.name : ``}*/}
                                        {/*             subcontent={(branchVal > 0 && branchType == 1) ? branchs.find(bit => (bit.id === branchVal))?.address : ``}*/}
                                        {/*             contentTextColor={`text-sky-500`} onClick={() => {*/}
                                        {/*    setBranchType(1);*/}
                                        {/*    setOpenStoreSheet(true);*/}
                                        {/*}} rightcontent={''} extraClassName={`w-full bg-white rounded-lg p-4`}>*/}

                                        {/*</ArrowObject>*/}

                                        {/*<ArrowObject icon={<HiLocationMarker className="mr-2 h-5 w-5 inline-block"/>}*/}
                                        {/*             title={`Địa chỉ`} padding={0} textSize={"large"}*/}
                                        {/*             content={(shippingAddress && shippingAddress?.id) ? shippingAddress.name + ' - ' + shippingAddress.phone : ``}*/}
                                        {/*             subcontent={(shippingAddress && shippingAddress?.id) ? shippingAddress.address : ``}*/}
                                        {/*             contentTextColor={`text-sky-500`} onClick={() => {*/}
                                        {/*    navigate('/my-addresses/cart');*/}
                                        {/*}} rightcontent={''}*/}
                                        {/*             extraClassName={`w-full bg-white rounded-lg p-4`}></ArrowObject>*/}


                                        <List noSpacing>
                                            <List.Item
                                                onClick={() => {
                                                    setBranchType(1);
                                                    setOpenStoreSheet(true);
                                                }}
                                                prefix={<HiMap className="h-5 w-5 "/>}
                                                title={<Text bold className={'zaui-link-text-color'}>Vị trí cửa hàng</Text>}
                                                suffix={<Icon icon="zi-chevron-right"/>}
                                                subTitle={(branchVal > 0 && branchType == 1) ? branchs.find(bit => (bit.id === branchVal))?.name : `Vui lòng chọn cửa hàng`}
                                            >{(branchVal > 0 && branchType == 1) ? branchs.find(bit => (bit.id === branchVal))?.address : ""}</List.Item>


                                            <List.Item
                                                onClick={() => {
                                                    // navigate('/my-addresses/cart');
                                                    setOpenAddressSheet(true);
                                                }}
                                                prefix={<HiLocationMarker className="h-5 w-5 "/>}
                                                title={<Text bold className={'zaui-link-text-color'}>Địa chỉ</Text>}
                                                suffix={<Icon icon="zi-chevron-right"/>}
                                                subTitle={(shippingAddress && shippingAddress?.id) ? shippingAddress.name + `  ${shippingAddress.phone ? `- ${shippingAddress.phone}` : ''}` : `Vui lòng chọn địa chỉ`}
                                            >{(shippingAddress && shippingAddress?.id) ? shippingAddress.address : ``}</List.Item>

                                        </List>

                                    </Tabs.Tab>
                                    <Tabs.Tab key="tai_cua_hang" label="Lấy tại cửa hàng">
                                        <List noSpacing>
                                            <List.Item
                                                onClick={() => {
                                                    setBranchType(2);
                                                    setOpenStoreSheet(true);
                                                }}
                                                prefix={<HiMap className="h-5 w-5 "/>}
                                                title={<Text bold className={'zaui-link-text-color'}>Vị trí cửa hàng</Text>}
                                                suffix={<Icon icon="zi-chevron-right"/>}
                                                subTitle={(branchVal > 0 && branchType == 2) ? branchs.find(bit => (bit.id === branchVal))?.name : ``}
                                            >{(branchVal > 0 && branchType == 2) ? branchs.find(bit => (bit.id === branchVal))?.address : ``}</List.Item>


                                            <List.Item  >
                                                <Picker
                                                    placeholder="Chọn thời gian"
                                                    mask
                                                    title="Thời gian nhận hàng"
                                                    maskClosable
                                                    prefix={<HiOutlineClock className="mr-4 h-5 w-5"/>}
                                                    suffix={ <Icon icon="zi-chevron-right"/>}
                                                    inputClass="border-none w-full flex bg-transparent  text-base text-black font-medium text-md m-0 p-0 h-auto"
                                                    formatPickedValueDisplay={(test) =>
                                                        test && test?.hour && test?.minute && test?.date
                                                            ? `${test?.hour?.displayName} : ${test?.minute?.displayName} - ${test?.date?.displayName}`
                                                            : `Chọn thời gian`
                                                    }
                                                    data={[
                                                        {
                                                            options: genHourDataState,
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
                                                    onChange={(value) => {
                                                        console.log('on change');
                                                        if (value?.date?.value != buyDate) {
                                                            setBuyDate(value?.date?.value);
                                                            if (value.date?.displayName == "Hôm nay") {
                                                                setgenHourDataState(genHourData(1));
                                                            } else {
                                                                setgenHourDataState(genHourData(0));
                                                            }
                                                        }
                                                        if (!value?.date || !value?.hour || !value?.minute) {
                                                            console.log('erro');
                                                        } else {
                                                            setBuyHour(value.hour.value);
                                                            setBuyMinute(value.minute.value);
                                                            setBuyDate(value.date.value);
                                                        }
                                                    }}
                                                />
                                            </List.Item>

                                        </List>
                                        {/*<ArrowObject icon={<HiMap className="mr-2 h-5 w-5 "/>}*/}
                                        {/*             title={`Vị trí cửa hàng`} padding={0} textSize={"large"}*/}
                                        {/*             content={(branchVal > 0 && branchType == 2) ? branchs.find(bit => (bit.id === branchVal))?.name : ``}*/}
                                        {/*             subcontent={(branchVal > 0 && branchType == 2) ? branchs.find(bit => (bit.id === branchVal))?.address : ``}*/}
                                        {/*             contentTextColor={`text-sky-500`} onClick={() => {*/}
                                        {/*    setBranchType(2);*/}
                                        {/*    setOpenStoreSheet(true);*/}
                                        {/*}} rightcontent={''}*/}
                                        {/*             extraClassName={`w-full bg-white rounded-lg p-4`}></ArrowObject>*/}

                                        {/*<div className="p-4 ">*/}
                                        {/*    <Picker*/}
                                        {/*        placeholder="Chọn thời gian"*/}
                                        {/*        prefix={<HiOutlineClock className="mr-2 h-5 w-5 inline-block"/>}*/}
                                        {/*        suffix={<HiOutlineArrowRight className="ml-2 h-4 w-4 "/>}*/}
                                        {/*        mask*/}
                                        {/*        maskClosable*/}
                                        {/*        inputClass="border-none bg-transparent text-base text-black font-medium text-md m-0 p-0 h-auto"*/}
                                        {/*        action={{*/}
                                        {/*            text: "Đóng",*/}
                                        {/*            close: true,*/}
                                        {/*        }}*/}

                                        {/*        formatPickedValueDisplay={(test) =>*/}
                                        {/*            (test && test?.hour && test?.minute && test?.date)*/}
                                        {/*                ? `${test?.hour?.displayName} : ${test?.minute?.displayName} - ${test?.date?.displayName}`*/}
                                        {/*                : `Chọn thời gian`*/}
                                        {/*        }*/}

                                        {/*        data={[*/}
                                        {/*            {*/}
                                        {/*                options: genHourDataState,*/}
                                        {/*                name: "hour",*/}
                                        {/*            },*/}
                                        {/*            {*/}
                                        {/*                options: genMinuteData(),*/}
                                        {/*                name: "minute",*/}
                                        {/*            },*/}
                                        {/*            {*/}
                                        {/*                options: genDateData(),*/}
                                        {/*                name: "date",*/}
                                        {/*            },*/}
                                        {/*        ]}*/}

                                        {/*        onChange={(value) => {*/}
                                        {/*            console.log('on change')*/}
                                        {/*            if (value?.date?.value != buyDate) {*/}
                                        {/*                setBuyDate(value?.date?.value);*/}
                                        {/*                if (value.date?.displayName == "Hôm nay") {*/}

                                        {/*                    setgenHourDataState(genHourData(1))*/}

                                        {/*                } else {*/}
                                        {/*                    setgenHourDataState(genHourData(0))*/}
                                        {/*                }*/}
                                        {/*            }*/}
                                        {/*            if (!value?.date || !value?.hour || !value?.minute) {*/}
                                        {/*                // setErrMsg(oldMsg => {*/}
                                        {/*                //     return {*/}
                                        {/*                //       ...oldMsg,*/}
                                        {/*                //       errMsg: "Bạn cần chọn đủ thời gian nhận hàng"*/}
                                        {/*                //     }*/}
                                        {/*                //   })*/}
                                        {/*                console.log('erro')*/}
                                        {/*            } else {*/}
                                        {/*                setBuyHour(value.hour.value);*/}
                                        {/*                setBuyMinute(value.minute.value);*/}
                                        {/*                setBuyDate(value.date.value);*/}

                                        {/*            }*/}
                                        {/*        }*/}
                                        {/*        }*/}
                                        {/*    />*/}
                                        {/*</div>*/}
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
                                        prefix={<Icon icon="zi-star"/>}
                                        title={<Text  bold className={'text-[#088c4c]'}>Chọn mã khuyến mãi</Text>}
                                        suffix={<Icon icon="zi-chevron-right"/>}
                                        subTitle=  {(selectedCoupon && selectedCoupon?.code) ? (parseInt(selectedCoupon?.discount_type || '0') !== 1 ? `${convertPrice(Number(selectedCoupon?.amount || 0))} đ` : `${convertPrice(Number(selectedCoupon?.amount || 0) * cart?.totalCart / 100)} đ`) : ''}

                                    />

                                    <List.Item

                                        prefix={<Icon icon="zi-note"/>}
                                        title={<Input
                                            focused={false}
                                            size={"small"}
                                            className={'border-none w-full no-border-focus pb-3'}
                                        placeholder="Nhập ghi chú..."
                                        />}

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

                                <List noSpacing>
                                    <List.Item
                                        onClick={() => {
                                            //setSelectedPaymentMe`thod(true)
                                            setOpenPaymentMethodSheet(true)
                                        }}
                                        prefix={<img className="w-9 h-9"
                                                     src={getImageSource(selectedPaymentMethod?.code as string) }/>}
                                        title={<Text  bold className={'text-[#088c4c]'}>{    (selectedPaymentMethod && selectedPaymentMethod?.id) ? selectedPaymentMethod?.title : ``}</Text>}
                                        suffix={<Icon icon="zi-chevron-right"/>}
                                        subTitle={
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: (selectedPaymentMethod?.notes) ? selectedPaymentMethod?.notes : ''
                                                }}
                                            />
                                        }
                                    />
                                </List>
                            </div>

                            {/*<ArrowObject title={`Phương thức thanh toán`} padding={0} textSize={"large"}*/}
                            {/*             content={(selectedPaymentMethod && selectedPaymentMethod?.id) ? selectedPaymentMethod.title : ``}*/}
                            {/*             contentTextColor={`text-sky-500`} onClick={() => {*/}
                            {/*    //setSelectedPaymentMe`thod(true)*/}
                            {/*    setOpenPaymentMethodSheet(true)*/}
                            {/*}} rightcontent={''}*/}
                            {/*             subcontent={(selectedPaymentMethod?.notes) ? selectedPaymentMethod?.notes : ''}*/}
                            {/*             extraClassName={`w-full bg-white rounded-lg p-4`}></ArrowObject>*/}
                        </Box>
                        <Text className={'pl-5 pr-5 pt-10 text-gray-500'}>
                            Bằng việc tiến hành thanh toán, bạn đồng ý với điều kiện và điều khoản sử dụng Zalo Mini app
                        </Text>
                    </div>
                </div>

            </div>
        </div>
    </Container>);
}
export default UserCart;
