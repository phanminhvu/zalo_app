import React, {useEffect, useState} from "react";
import Container from "../../components/layout/Container";
import useSetHeader from "../../hooks/useSetHeader";
import {selectedShippingMethodState, shippingMethodsState} from "../../states/cart";
import {useRecoilState} from "recoil";
import {Icon, List, useNavigate} from "zmp-ui";
import {Spinner} from "flowbite-react";

const ShippingMethods = () => {
    const [shippingMethods,setShippingMethods] = useRecoilState(shippingMethodsState);
    const [selectedShippingMethod,setSelectedShippingMethod] = useRecoilState(selectedShippingMethodState);
    const setHeader = useSetHeader();
    const navigate = useNavigate();
    const [loading,setLoading] = useState<boolean>(false);
    useEffect(() => {
        setHeader({
            customTitle:  "Phương thức vận chuyển",
            hasLeftIcon: true,
            type: "secondary",
            showBottomBar: true
        });
    }, []);
    const { Item } = List;
    return  (<Container>
        {loading && (<div className="text-center pt-10"><Spinner
            size="xl"
        /></div>)}
        {(shippingMethods  && !loading) && <List className="bg-white">
            {shippingMethods.map((shipping,index) => {
                return shipping.enabled ? (<Item key={`shipping${index}`} className={`mb-0`} title={shipping.title} onClick={() => {
                    setSelectedShippingMethod(shipping);
                    navigate('/checkout');
                }}
                suffix={(selectedShippingMethod && selectedShippingMethod.id === shipping.id) ? <Icon icon="zi-check" /> : <></>}/>) : (<></>)
            })}
        </List>}
    </Container>);
}
export default ShippingMethods;
