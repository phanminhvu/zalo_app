import React, { useEffect,useState, useMemo, useCallback } from "react";
import Container from "../components/layout/Container";
import {Page, Tabs, List, Icon, Avatar, Box, Text, Input, Checkbox} from "zmp-ui";
import {Button, Table, Spinner} from 'flowbite-react';
import {useNavigate} from "react-router-dom";
import useSetHeader from "../hooks/useSetHeader";
import {
    getAffDashboardUrl,
    postAffSetting,
    getAffSettings,
    getAffDashboardStats,
    getAffDashboardPayouts,
    getAffDashboardReferrals,
    getAffDashboardVisits,
    postAddress
} from "../services/auth";
const AffiliatePage = () => {
    const navigate = useNavigate();
    const setHeader = useSetHeader();
    const [affDashboardUrl,setAffDashboardUrl] = useState(null);
    const [affSettings,setAffSettings] = useState(null);
    const [affDashboardStats,setAffDashboardStats] = useState(null);
    const [affDashboardPayouts,setAffDashboardPayouts] = useState(null);
    const [affDashboardReferrals,setAffDashboardReferrals] = useState([]);
    const [affDashboardVisits,setAffDashboardVisits] = useState(null);
    const [paymentEmail,setPaymentEmail] = useState("");
    const [loading,setLoading] = useState(false);
    const [dataLoading,setDataLoading] = useState(false);
    const [referralNotifications,setReferralNotifications] = useState(false);
    useEffect(() => {

        setHeader({
            customTitle:  "Tiếp thị liên kết",
            hasLeftIcon: true,
            type: "secondary",
            showBottomBar: true
        });
        setDataLoading(true)
        getAffDashboardUrl().then((res) => {
            setAffDashboardUrl(res);
        });
        getAffSettings().then((res) => {
            setAffSettings(res);
            setPaymentEmail(res.payment_email);
            setReferralNotifications(res.referral_notifications);
        });
        getAffDashboardStats().then((res) => {
            setAffDashboardStats(res);
        });
        getAffDashboardPayouts().then((res) => {
            setAffDashboardPayouts (res);
        });
        getAffDashboardReferrals().then((res) => {
            setAffDashboardReferrals (res?.length > 0  ? res: [{
                referral_id: "2",
                amount: 3,
                description:"hello",
                status:"success",
                date:"2023-09-09"
            }]);
        });
        getAffDashboardVisits().then((res) => {
            setAffDashboardVisits (res);
            setDataLoading(false);
        });
    },[])
    return (<Container className={'bg-white'}>
        <Tabs id="affilate-list" scrollable className={'bg-white'}>
            <Tabs.Tab key="tab1" label="Liên kết">
                {affDashboardUrl && <Box  p={4}>
                    <Text size={"small"} bold>{`ID cộng tác viên của bạn: ${affDashboardUrl.id}`}</Text>
	                <Text size={"small"} bold className={`pt-3`}>{`URL giới thiệu của bạn: `}</Text>
	                <Text size={"small"}  className={`pt-1`}>{`${affDashboardUrl.referral_url}`}</Text>
                </Box>}

            </Tabs.Tab>
            <Tabs.Tab key="tab2" label="Thống kê">
                {affDashboardStats && <Box  p={4}>
	                <Text size={"small"} bold className={`pt-2`}>{`Giới thiệu chưa thanh toán: ${affDashboardStats.unpaid}`}</Text>
	                <Text size={"small"} bold className={`pt-2`}>{`Giới thiệu đã thanh toán: ${affDashboardStats.paid}`}</Text>
	                <Text size={"small"} bold className={`pt-2`}>{`Lượt truy cập: ${affDashboardStats.visits}`}</Text>
	                <Text size={"small"} bold className={`pt-2`}>{`Tỉ lệ chuyển đổi: ${affDashboardStats.rate}`}</Text>
	                <Text size={"small"} bold className={`pt-2`}>{`Thu nhập chưa thanh toán: ${affDashboardStats.upaidearnings}`}</Text>
	                <Text size={"small"} bold className={`pt-2`}>{`Thu nhập đã thanh toán: ${affDashboardStats.paidearnings}`}</Text>
	                <Text size={"small"} bold className={`pt-2`}>{`Tỉ lệ hoa hồng: ${affDashboardStats.affiliatewp}`}</Text>
                </Box>}
            </Tabs.Tab>
            <Tabs.Tab key="tab3" label="Các giới thiệu">
                {affDashboardReferrals && <Box  p={4}>
	                <Table striped>
		                <Table.Head>
			                <Table.HeadCell>
				                Tham chiếu
			                </Table.HeadCell>
			                <Table.HeadCell >
				                Số lượng
                            </Table.HeadCell>
			                <Table.HeadCell >
				                Mô tả
			                </Table.HeadCell >
			                <Table.HeadCell>
				                Trạng thái
                            </Table.HeadCell>
			                <Table.HeadCell >
				                Ngày
			                </Table.HeadCell>
		                </Table.Head>
		                <Table.Body className="divide-y">
                            {affDashboardReferrals.map((referal,rIndex) => {
                                return <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                                        {referal.referral_id}
                                    </Table.Cell>
                                    <Table.Cell className="">
                                        {referal.amount}
                                    </Table.Cell>
                                    <Table.Cell className="">
                                        {referal.description}
                                    </Table.Cell>
                                    <Table.Cell className="">
                                        {referal.status}
                                    </Table.Cell>
                                    <Table.Cell className="">
                                        {referal.date}
                                    </Table.Cell>
                                </Table.Row>
                            })}
                        </Table.Body>
                    </Table>
                </Box>}
            </Tabs.Tab>
            <Tabs.Tab key="tab4" label="Thanh toán" >
                {affDashboardPayouts && <Box  p={4}>
	                <Table striped>
		                <Table.Head>
			                <Table.HeadCell>
				                Ngày
			                </Table.HeadCell>
			                <Table.HeadCell >
				                Số lượng
			                </Table.HeadCell>
			                <Table.HeadCell >
				                Phương pháp quảng bá
			                </Table.HeadCell >
			                <Table.HeadCell>
				                Trạng thái
			                </Table.HeadCell>
		                </Table.Head>
                        <Table.Body className="divide-y">
                            {affDashboardPayouts.map((payout,rIndex) => {
                                return <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="">
                                            {payout.date}
                                        </Table.Cell>
                                        <Table.Cell className="">
                                            {payout.amount}
                                        </Table.Cell>
                                        <Table.Cell className="">
                                            {payout.payout_method}
                                        </Table.Cell>
                                        <Table.Cell className="">
                                            {payout.status}
                                        </Table.Cell>
                                    </Table.Row>
                            })}
                        </Table.Body>
                    </Table></Box>}
            </Tabs.Tab>
            <Tabs.Tab key="tab5" label="Truy cập">
                {affDashboardVisits && <Box  p={4}>
	                <Table striped>
		                <Table.Head>
			                <Table.HeadCell>
				                Url
			                </Table.HeadCell>
			                <Table.HeadCell >
				                Url giới thiệu
			                </Table.HeadCell>
			                <Table.HeadCell >
				                Đã chuyển đổi
			                </Table.HeadCell >
			                <Table.HeadCell>
				                Ngày
			                </Table.HeadCell>
		                </Table.Head>
		                <Table.Body className="divide-y">
                            {affDashboardVisits.map((visit,rIndex) => {
                                return <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="">
                                        {visit.url}
                                    </Table.Cell>
                                    <Table.Cell className="">
                                        {visit.referrer}
                                    </Table.Cell>
                                    <Table.Cell className="">
                                        {visit.converted}
                                    </Table.Cell>
                                    <Table.Cell className="">
                                        {visit.date}
                                    </Table.Cell>
                                </Table.Row>
                            })}
		                </Table.Body>
	                </Table></Box>}
            </Tabs.Tab>
            <Tabs.Tab key="tab6" label="Cài đặt">
                <Box mt={1} className={"bg-white p-4"}>
                    <Input
                        type="text"
                        size={"small"}
                        placeholder="Email thanh toán của bạn"
                        onChange={(e) =>{
                            setPaymentEmail(e.target.value);
                        }}
                        value={paymentEmail}
                        className="mt-2 border-slate-200"
                    />
                    <Checkbox label="Bật thông báo Giới thiệu mới" checked={referralNotifications} onChange={()=>{setReferralNotifications(!referralNotifications)}} className={'mt-2'}/>
                </Box>
                <Button.Group className={`flex w-full  bottom-0 mt-4`}>
                    <Button className={`flex-1 border-l-0 border-b-0 rounded-none bg-pink-900`} onClick={async ()=>{
                        const sData = referralNotifications === true ? {payment_email: paymentEmail, referral_notifications: true} : {payment_email: paymentEmail}
                        setLoading(true)
                        postAffSetting(sData).then(() => {
                            setLoading(false)
                        });
                    }}>
                        {loading && <Spinner
		                    size="sm"
	                    />}
                        <span className="pl-3">
                            Lưu
                        </span>
                    </Button>
                </Button.Group>
            </Tabs.Tab>
        </Tabs>
        {dataLoading && <Box className={'text-center w-full'}><Spinner
		    size="lg"
        /></Box>}
    </Container>);
}
export default AffiliatePage;
