import React, {useEffect, useState} from "react";
import useSetHeader from "../../hooks/useSetHeader";
import {useRecoilState, useRecoilValue} from "recoil";
import {authState} from "../../states/auth";
import {Box, List, Text} from "zmp-ui";
import Container from "../../components/layout/Container";
import EmptyBox from "../../components/empty";
import {Order} from "../../models";
import {Button} from "flowbite-react";
import {convertPrice} from "../../utils";
import {statusArray} from "../../utils/constants";
import {userOrdersState} from "../../states/cart";

const Orders =  () => {
    const setHeader = useSetHeader();
    const authDt = useRecoilValue(authState);
    const [page,setPage] = useState(1);
    const [showLoadMore,setShowLoadMore] = useState(true);
    const [userOrders, setUserOrders] = useRecoilState<Order[]>(
        userOrdersState
    );
    const [activeOrderStatus,setActiveOrderStatus] = useState('processing');
    useEffect(() => {
        setHeader({
            customTitle:  "Đơn hàng",
            hasLeftIcon: true,
            type: "secondary",
            showBottomBar: true
        });
      }, []);
    useEffect(()=>{
       /* setLoading(true);
        WooWorker.getUserOrders(authDt.profile.id,page,12).then((res) => {
            setUserOrders(old => {
                if(old && old.length > 0) {
                    return [...old,...res];
                }else{
                    return res;
                }
            });
            setLoading(false);
            console.log("Load moẻ", res && res.length > 0)
            setShowLoadMore(res && res.length > 0);
        });*/
    }, [page])
      const { Item } = List;
    return <Container>
        {(userOrders && userOrders.length > 0 ) && <div className="bg-white pb-32">
            <div className="w-full border-b border-gray-200 overflow-auto" >
                <nav className="flex space-x-2 overscroll-x-auto " aria-label="Tabs" role="tablist">
                    {statusArray.map(({key,label}) => {
                        return <button key={`cat_${status}`} type="button"
                                       className={`font-semibold ${(activeOrderStatus && activeOrderStatus === key) ? 'text-primary  border-b border-primary' : ''}  py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap`}
                                       data-hs-tab="#tabs-with-underline-1"
                                       aria-controls="tabs-with-underline-1" role="tab" onClick={()=>{
                            setActiveOrderStatus(key);
                        }}>{label}</button>
                    })}
                </nav>
            </div>
        {!userOrders?.filter(uOrder => (uOrder?.status === activeOrderStatus)) && <EmptyBox title={`Bạn chưa có đơn hàng nào`} content={`Hãy tận hưởng mua sắm`}/>}
        {userOrders?.filter(uOrder => (uOrder?.status === activeOrderStatus)) && userOrders?.filter(uOrder => (uOrder?.status === activeOrderStatus))?.map((order,index) => {
            return <Box p={4} className="border-b border-slate-300">
                {/*<div className="flex">
                    <Text size="small" className="font-bold flex-1">{order.store.shop_name}</Text>
                    <Text size="xxSmall" className="text-primary">{statusArray?.find(sI => (sI.key === order.status))?.label }</Text>
                </div>*/}
                {order.line_items.filter(it => (it.parent == 0)).map((litem,litemIndex) => {
                    const childItems = order.line_items?.filter(cIt => cIt.parent === litem.id);
                    let totalItemPrice = litem.price;let totalSubItemPrice = litem.subtotal;
                    if(childItems && childItems?.length > 0){
                        childItems.map(child => {
                            totalItemPrice += child.price;
                            totalSubItemPrice+= child.subtotal;
                        })
                    }

                    return (
                        <div className="flex mt-4" key={`li${litemIndex}`}>
                            <img className="h-16 w-16 mr-4" src={`${litem.image}`} alt={`${litem.name}`}/>
                            <div className="w-full">
                                <div className="flex mt-1">
                                    <div className={`flex-1 `}>
                                        <p className="font-medium text-sm">{`${litem.name}`}</p>
                                        {(childItems && childItems?.length > 0) && <div className="text-xs grey-price-color mt-1"><span>{`Đồ ăn thêm: `}</span>{childItems?.map(chItem => {
                                            return (<span>{chItem.name+', '}</span>)
                                        })}</div>}
                                         {/*(litem.meta_data && litem.meta_data.length) && <p className="text-xs text-slate-400 mt-1">{`${litem.meta_data.filter(mData => (mData.key.indexOf('_') === -1)).map(mData => {
                                                return mData.value
                                        }).join(', ')}`}</p>*/}
                                    </div>
                                </div>
                                <div className="flex mt-1">
                                    <Text className={"mt-1 flex-1"}>{`${litem.quantity} x ${convertPrice(totalItemPrice)} đ`}</Text>
                                    <Text className={"mt-1"}>{`${convertPrice(Number(totalSubItemPrice))} đ`}</Text>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div className="flex mt-4">
                    <Text size="xxSmall" className="flex-1 text-start">{`${order.line_items.length} sản phẩm`}</Text>
                    <Text size="small" className="flex-1 text-end">
                        <span className="mr-1">{'Thành tiền'}</span><span className="text-primary">{convertPrice(order.total)} đ</span>
                    </Text>
                </div>
            </Box>

        })}</div>}
        {showLoadMore && <div className="flex items-center justify-center text-center w-full px-4 py-4">
		    <Button onClick={()=>{
                setPage(old => old+1)
            }} color="gray">
			    <span className="pl-3">{"Xem thêm"}</span>
		    </Button>
	    </div>}
    </Container>
}
export default Orders;
