import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import {pageGlobalState, openCouponPickerState, openPaymentMethodPickerState} from "../state";
import React, { useRef } from "react";
import {Box, Text,Sheet, List, Icon} from "zmp-ui";
import {  PaymentMethod } from "../models";
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
                    title=""
                >
                    {paymentMethods?.filter(c=>c.enabled === true)?.length > 0 && <List>{/*zi-check-circle*/}
                        {paymentMethods.filter(c=>c.enabled === true).map((method,index) => {
                            return (<Item key={`method${index}`} className={`mb-0`} title={method.title}  onClick={() => {
                                setSelectedPaymentMethod(method);
                                setOpenSheet(false)
                            }}
                            suffix={(selectedPaymentMethod && selectedPaymentMethod?.id === method?.id) ? <Icon icon="zi-check-circle" /> :  <Icon icon="zi-info-circle" />}/>)
                        })}
                    </List>}
                </Sheet>
            )}</>);
}
export default PaymentsPicker;

