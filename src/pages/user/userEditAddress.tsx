import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSetHeader} from "../../hooks";
import {
    branchPointState,
    isMappingState,
    pageGlobalState,
    userAddressesState,
    userEditingAddressState
} from "../../state";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {Address, AuthData} from "../../models";
import {Box, Button, Icon, Input, Switch, Text} from "zmp-ui";
import Container from "../../components/layout/Container";
import {loadAddresses, resetAddress, saveAddress} from "../../services/storage";
import AddressSearchItemList from "../../components/auto-complete-address-item-list";
import {HiLocationMarker} from 'react-icons/hi';
import {addressAutoState, shippingAddressState} from "../../states/cart";
import {authState} from "../../states/auth";

const UserEditAddress = () => {
    const setHeader = useSetHeader();
    const navigate = useNavigate();
    const setErrMsg = useSetRecoilState(pageGlobalState);
    let {from} = useParams();
    const [addressAuto, setAddressAuto] = useRecoilState<boolean>(
        addressAutoState
    );
    const [userAddresses, setUserAddresses] = useRecoilState<Address[]>(
        userAddressesState
    );
    const [userEditingAddress, setUserEditingAddress] = useRecoilState<Address>(
        userEditingAddressState
    );
    const [isMapping, setIsMapping] = useRecoilState<boolean>(
        isMappingState
    );

    useEffect(() => {
        setHeader({
            customTitle: (addressAuto == true) ? "Tìm địa chỉ" : ((userEditingAddress && userEditingAddress?.id > 0) ? "Sửa địa chỉ" : "Thêm địa chỉ mới"),
            hasLeftIcon: true,
            type: "secondary",
            showBottomBar: false,
            showTotalCart: false,
        });
    }, [addressAuto, userEditingAddress]);


    const [shippingAddress, setShippingAddress] = useRecoilState<Address>(
        shippingAddressState
    );

    const authDt = useRecoilValue<AuthData>(authState);
    useEffect(() => {
        if (!userEditingAddress || !userEditingAddress?.address || userEditingAddress?.address === "") {
            setAddressAuto(true);
        }
    }, [userEditingAddress])
    useEffect(() => {

        if (!addressAuto && userEditingAddress?.name === "" && userEditingAddress?.phone === "") {
            setUserEditingAddress({
                ...userEditingAddress,
                name: authDt?.profile?.name,
                phone: authDt?.profile?.phone,
                email: authDt?.profile?.email
            })
        }
    }, [addressAuto])
    return (<Container className={"zui-container-background-color"}>
        <Box mt={1} className={"zui-container-background-color pt-4 "}>

            {/*auto == true && <Autocomplete
                apiKey={GOOGLE_MAPS_API_KEY}
                onPlaceSelected={(place) => {
                    setUserEditingAddress({
                        ...userEditingAddress,
                        address: place?.formatted_address
                    })
                    setAuto(false);
                }}
                language={`vi`}
                />*/}
            {addressAuto && <AddressSearchItemList/>}
            {(!addressAuto && userEditingAddress?.address) &&
                <div className=" w-11/12 bg-white rounded-lg ml-auto mr-auto p-4 flex" onClick={() => {
                    setAddressAuto(true);
                }}><HiLocationMarker className="mr-2 h-5 w-5 inline-block"/>
                    <Text>{userEditingAddress?.address}</Text><Icon icon="zi-chevron-right" size={24}/></div>}

            {(!addressAuto && userEditingAddress?.address) && <Box className={"bg-white p-4 mt-4"}>
                <div className={" mt-4"}>
                    <Text>Tên người nhận *</Text>
                    <Input
                        type="text"
                        size={"medium"}
                        placeholder="Tên người nhận"
                        onChange={(e) => {
                            setUserEditingAddress({
                                ...userEditingAddress,
                                name: e.target.value
                            })
                        }}
                        value={userEditingAddress?.name}
                        className="border-slate-200"
                    />
                </div>
                <div className={" mt-4"}>
                    <Text >Số điện thoại *</Text>
                    <Input
                        type="number"
                        size={"medium"}
                        placeholder="Số điện thoại"
                        onChange={(e) => {
                            setUserEditingAddress({
                                ...userEditingAddress,
                                phone: e.target.value
                            })
                        }}
                        value={userEditingAddress?.phone}
                        className="border-slate-200"
                    />
                </div>
                <div className={" mt-4"}>
                    <Text>Ghi chú khác</Text>
                    <Input
                        type="text"
                        size={"medium"}
                        placeholder="Ghi chú khác"
                        onChange={(e) => {
                            setUserEditingAddress({
                                ...userEditingAddress,
                                notes: e.target.value
                            })
                        }}
                        value={userEditingAddress?.notes}
                        className="border-slate-200"
                    />
                </div>
                <div className={" mt-4"}>
                    <Switch label="Đặt làm mặc định" className={" "} size={"medium"} onChange={(e) => {
                        setUserEditingAddress({
                            ...userEditingAddress,
                            default: e.target.checked
                        })
                    }} checked={userEditingAddress?.default || false}/>
                </div>

            </Box>}
            {(!addressAuto && userEditingAddress?.id && userEditingAddress?.address) ? <Button variant={`tertiary`}
                                                                                                className={'border-l-0 border-b-0 ml-auto mr-auto block mt-6 px-0 py-2 text-sm  text-rose-600'}
                                                                                                onClick={() => {
                                                                                                    setUserAddresses(old => {
                                                                                                        return old.filter(oAddress => oAddress.id !== userEditingAddress.id);
                                                                                                    });
                                                                                                    resetAddress(userAddresses.filter(oAddress => oAddress.id !== userEditingAddress.id));
                                                                                                    navigate(`/my-addresses/${from}`);
                                                                                                }}>
                <Icon icon="zi-delete"/>Xóa địa chỉ</Button> : ""}
            {(!addressAuto && userEditingAddress?.address) && <Button
                className={`h-10 w-10/12 border-l-0 border-b-0 rounded-full ml-auto mr-auto block mt-6 px-0 py-2`}
                onClick={async () => {
                    const selectedAddress = await saveAddress(userEditingAddress)
                    const cachedUserAddresses = await loadAddresses();
                    setUserAddresses(cachedUserAddresses);
                    if (isMapping) {
                        setShippingAddress(selectedAddress);
                        navigate(`/cart`);
                    } else {
                        navigate(`/my-addresses/${from}`);
                    }


                }}><Icon icon="zi-plus-circle" size={24}/> {`Lưu thông tin`}</Button>
            }

        </Box>
    </Container>)
}
export default UserEditAddress;
