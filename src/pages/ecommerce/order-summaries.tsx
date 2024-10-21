import React, {useEffect} from "react";
import Container from "../../components/layout/Container";
import useSetHeader from "../../hooks/useSetHeader";
import {useNavigate} from "zmp-ui";
import {changeStatusBarColor} from "../../services";

const OrderSummaries =  () => {
    const setHeader = useSetHeader();
    const navigate = useNavigate();
    useEffect(() => {
        setHeader({
            customTitle:  "Order Summaries",
            hasLeftIcon: false,
            type: "secondary"
        });
        changeStatusBarColor("secondary");
    }, []);
    return (<Container>

    </Container>)
}
export default OrderSummaries;
