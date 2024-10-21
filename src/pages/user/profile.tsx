import React, {useEffect} from "react";
import {Box, Icon, List, useNavigate} from "zmp-ui";
import Container from "../../components/layout/Container";
import {HiOutlineFlag, HiOutlineShoppingCart, HiOutlineUser} from "react-icons/hi";
import {useRecoilValue} from "recoil";
import {authState} from "../../states/auth";
import useSetHeader from "../../hooks/useSetHeader";
import {showOAWidget} from "zmp-sdk/apis";

const { Item } = List;
const UserProfile = () => {
    const navigate = useNavigate();
    const authDt = useRecoilValue(authState);
    const setHeader = useSetHeader();
    useEffect(() => {
        setHeader({
            customTitle:  "Trang cá nhân",
            hasLeftIcon: true,
            type: "secondary",
            showBottomBar: true
        });
        showOAWidget({
            id: "oaWidget",
            guidingText: "Nhận thông báo khuyến mãi mới nhất từ cửa hàng",
            color: "#0068FF",
            onStatusChange: (status) => {
                console.log(status);
            }
        });
    }, []);
    return (<Container className={'  zui-container-background-color'}>
        {/*<Box flex p={4}>
            <Avatar size={48} src={authDt.profile.picture}/>
            <div className={"ml-4"}>
                <Text bold>{authDt.profile.name}</Text>
                <Text size={'xxSmall'} className={'mt-1'}>{`Id: `+ authDt.profile.zaloId}</Text>
            </div>
        </Box>
        <Box m={4} p={4} className={"rounded-md rouded-profile-background bg-opacity-10"}>
            <div className={"flex"}>
                <div className={"flex-1"}>
                    <Text bold>{`Thành viên`}</Text>
                    <Text  bold className={'mt-1 text-primary'}>{`CHƯA XẾP HẠNG`}</Text>
                </div>
                <div className={"flex-1"}>
                    <Text bold>{`Điểm tích luỹ`}</Text>
                    <Text  bold className={'mt-1 text-primary'}>{`0`}</Text>
                </div>
                <div className={""}>

                </div>
            </div>
            <div className={"flex mt-2"}>
                <Text >{`Điểm để đạt thứ hạng kế tiếp:`}</Text>
                <Text bold className={'text-primary ml-2'}>{`0`}</Text>
            </div>
            <Progress completed={1} maxCompleted={100} strokeColor={"var(--zmp-primary-color) "} showLabel />
            <div className={"text-center mt-2"}>
                <Barcode value={authDt.profile.zaloId} width={2} height={50} background={"white "}/>
            </div>
            <div className={"mt-4"}>
                <ArrowObject textSize="normal" padding={0} iconmar={2} icon={<HiColorSwatch size={20} style={{ fill: 'var(--zmp-primary-color)' }}/>} title={`Mã giảm giá`} content={''} bg={'bg-transparent'} onClick={()=>{
                    navigate("/");
                }} ></ArrowObject>
            </div>
        </Box>*/}
        <Box m={4} p={0} className={"rounded-lg bg-white"}>
            <List>
                <Item title="Thông tin tài khoản" prefix={<HiOutlineUser size={20} />} className={"text-sm m-0"} suffix={<Icon icon="zi-chevron-right" />} onClick={()=> {
                    navigate('/user-info');
                }} />
                <Item title="Địa chỉ đã lưu" prefix={<HiOutlineFlag size={20} />} suffix={<Icon icon="zi-chevron-right" />} className={"text-sm m-0"}  onClick={()=> {
                    navigate('/my-addresses/profile');
                }} />
                <Item title="Lịch sử đơn hàng" prefix={<HiOutlineShoppingCart size={20} />} suffix={<Icon icon="zi-chevron-right" />} className={"text-sm m-0"}  onClick={()=> {
                    navigate('/my-orders');
                }} />
            </List>
        </Box>
        <Box m={4} p={0} className={"rounded-lg bg-white"}>
            <List>
                <Item title="Chính sách riêng tư"  className={"text-sm m-0"} suffix={<Icon icon="zi-chevron-right" />} onClick={()=> {
                    navigate('/detail-new/3');
                }} />
                <Item title="Điều khoản dịch vụ" suffix={<Icon icon="zi-chevron-right" />} className={"text-sm m-0"}  onClick={()=> {
                    navigate('/detail-new/4');
                }} />
                <Item title="Hướng dẫn sử dụng" suffix={<Icon icon="zi-chevron-right" />} className={"text-sm m-0"}  onClick={()=> {
                    navigate('/detail-new/1');
                }} />
            </List>
        </Box>
        <Box
            m={4}
            p={0}
            className="rounded-lg bg-white"
        >
            <div id='oaWidget' />
        </Box>
    </Container>);
}
export default UserProfile;




// import React, { useState, useEffect } from "react";
// import { Box, Icon, Button, Text } from "zmp-ui";
// import { getAccessToken, getPhoneNumber } from "zmp-sdk/apis";
// import { useSnackbar } from "zmp-ui";

// const UserProfile = () => {
//   const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
//   const { openSnackbar } = useSnackbar();

//   useEffect(() => {
//     // Kiểm tra xem số điện thoại đã được lưu trong sessionStorage chưa
//     const savedPhoneNumber = sessionStorage.getItem("phoneNumber");
//     if (savedPhoneNumber) {
//       setPhoneNumber(savedPhoneNumber);
//     }
//   }, []);

//   const checkContact = async (phoneNumber: string) => {
//     try {
//       const response = await fetch("https://quequan.vn:8081/customer/phonenumber", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ phoneNumber }),
//       });

//       const result = await response.json();
//       if (result.isSuccess) {
//         openSnackbar({
//           text: `Số điện thoại ${phoneNumber} đã đăng ký.`,
//           type: "success",
//           duration: 5000,
//         });
//       } else {
//         openSnackbar({
//           text: `Số điện thoại ${phoneNumber} chưa được đăng ký.`,
//           type: "error",
//           duration: 5000,
//         });
//       }
//     } catch (error) {
//       console.error("Lỗi khi kiểm tra số điện thoại:", error);
//       openSnackbar({
//         text: "Lỗi khi kiểm tra số điện thoại trên server.",
//         type: "error",
//         duration: 5000,
//       });
//     }
//   };

//   const handleAccessSystem = async () => {
//     try {
//       // Lấy accessToken từ Zalo SDK
//       const accessToken = await getAccessToken({});
      
//       if (!accessToken) {
//         throw new Error("Không thể lấy Access Token. Vui lòng đăng nhập lại.");
//       }

//       console.log("Access Token:", accessToken);

//       // Lấy số điện thoại từ Zalo SDK
//       getPhoneNumber({
//         success: async (data) => {
//           const { phoneNumber: rawPhoneNumber } = data;
          
//           // Chuyển đổi đầu số 84 thành 0
//           let formattedPhoneNumber = rawPhoneNumber.startsWith("84")
//             ? rawPhoneNumber.replace(/^84/, "0")
//             : rawPhoneNumber;

//           console.log("Số điện thoại đã định dạng:", formattedPhoneNumber);

//           // Lưu số điện thoại vào sessionStorage
//           sessionStorage.setItem("phoneNumber", formattedPhoneNumber);
//           setPhoneNumber(formattedPhoneNumber);

//           // Kiểm tra số điện thoại trên hệ thống server
//           await checkContact(formattedPhoneNumber);
//         },
//         fail: (error) => {
//           console.error("Lỗi khi lấy số điện thoại từ Zalo:", error);
//           openSnackbar({
//             text: "Không thể lấy số điện thoại. Vui lòng thử lại.",
//             type: "error",
//             duration: 5000,
//           });
//         },
//       });
//     } catch (error) {
//       console.error("Lỗi khi lấy access token:", error);
//       openSnackbar({
//         text: "Không thể lấy access token. Vui lòng thử lại.",
//         type: "error",
//         duration: 5000,
//       });
//     }
//   };

//   return (
//     <Box textAlign="center" mt={6}>
//       <Text.Title level={2}>Tập đoàn BSD</Text.Title>
//       {phoneNumber ? (
//         <Text>Số điện thoại của bạn: {phoneNumber}</Text>
//       ) : (
//         <Button variant="secondary" onClick={handleAccessSystem}>
//           Đăng nhập
//         </Button>
//       )}
//     </Box>
//   );
// };

// export default UserProfile;
