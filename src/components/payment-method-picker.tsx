import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import {pageGlobalState, openCouponPickerState, openPaymentMethodPickerState} from "../state";
import React, { useRef } from "react";
import {Box, Text, Sheet, List, Icon, Avatar} from "zmp-ui";
import {  PaymentMethod } from "../models";
import cod from './buy.png';
import bank from './bank.png'
import checkBox from './checkbox.png'
import check from './check.png'
import { paymentMethodsState, selectedCouponState, selectedPaymentMethodState } from "../states/cart";
const { Item } = List;
const PaymentsPicker = () => {
    const setErrMsg = useSetRecoilState(pageGlobalState)
    const [openSheet, setOpenSheet] = useRecoilState<boolean>(
        openPaymentMethodPickerState
    );
    const paymentMethods = useRecoilValue<PaymentMethod[]>(paymentMethodsState);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useRecoilState<PaymentMethod>(
        selectedPaymentMethodState
    );
    const sheet = useRef<any>(null);

    const getImageSource = (code: string) => {
        let source = ''
        switch (code) {
            case 'COD':
                source = cod
                break;
            case 'Bank':
                source = bank
                break;
        }
        return source
    }

    return (
        <>
            {paymentMethods && (
                <Sheet
                    mask
                    visible={openSheet}
                    swipeToClose
                    maskClosable

                    onClose={() => setOpenSheet(false)}
                    afterClose={() => {

                    }}
                    ref={sheet}
                    autoHeight
                    title="Phương thức thanh toán"

                >
                    <div className='w-full bg-blue-100 '>
                        <Text className={'text-center pl-4 pr-4 pt-3 pb-3'}>Vui lòng chọn hình thức thanh toán phù hợp cho đơn hàng của bạn</Text>
                    </div>


                    {paymentMethods?.filter(c=>c.enabled === true)?.length > 0 && <List

                    >{/*zi-check-circle*/}
                        <Item
                            title={<Text bold size={'xLarge'} >{`Phương thức thanh toán`}</Text>}
                        />
                        {paymentMethods.filter(c=>c.enabled === true).map((method,index) => {
                            return (<Item key={`method${index}`}  title={
                                <div className="flex items-center ">
                                    {(selectedPaymentMethod && selectedPaymentMethod?.id === method?.id) ?
                                        <img className="w-5 h-5 flex" src={check}/>
                                        :
                                        <img className="w-5 h-5 flex" src={checkBox}/>

                                    }
                                    <img className="w-10 h-10 ml-5" src={getImageSource(method.code)}/>
                                    <Text className={'ml-5'}>
                                        {method.title}
                                    </Text>
                                </div>
                            }
                                          onClick={() => {
                                              setSelectedPaymentMethod(method);
                                              setOpenSheet(false)
                            }}


                                />

                            )
                        })}
                    </List>}
                </Sheet>
            )}</>);
}
export default PaymentsPicker;

