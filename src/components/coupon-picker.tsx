import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import {pageGlobalState, openCouponPickerState} from "../state";
import React, { useRef } from "react";
import { couponsState} from "../states/home";
import {Box, Text,Sheet, List, Icon} from "zmp-ui";
import { Coupon } from "../models";
import { selectedCouponState } from "../states/cart";
const { Item } = List;
const CouponsPicker = () => {
    const setErrMsg = useSetRecoilState(pageGlobalState)
    const [openSheet, setOpenSheet] = useRecoilState<boolean>(
        openCouponPickerState
    );
    const coupons = useRecoilValue<Coupon[]>(couponsState);
    const [selectedCoupon, setSelectedCoupon] = useRecoilState<Coupon>(
        selectedCouponState
    );
    const sheet = useRef<any>(null);
    return (
        <>
            {coupons && (
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
                    {coupons?.filter(c=>c.status === 1)?.length > 0 && <List>{/*zi-check-circle*/}
                        {coupons.filter(c=>c.status === 1).map((coupon,index) => {
                            return (<Item key={`coupon${index}`} className={`mb-0`} title={coupon.description} subTitle={`HSD: ${coupon.date_expires ? moment(coupon.date_expires).format("DD/MM/YYYY") : 'Không giới hạn'}`} onClick={() => {
                                setSelectedCoupon(coupon);
                                setOpenSheet(false)
                            }}
                            suffix={(selectedCoupon && selectedCoupon?.code === coupon?.code) ? <Icon icon="zi-check-circle" /> :  <Icon icon="zi-info-circle" />}/>)
                        })}
                    </List>}
                    {(!coupons?.filter(c=>c.status === 1)?.length) && <div className={'py-8 px-4'}><Text>{`Hiện tại chưa có mã giảm giá nào`}</Text></div>}     
                    
                </Sheet>
            )}</>);
}
export default CouponsPicker;
