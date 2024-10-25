import React, {useEffect} from "react";
import {loadAddresses} from "../../services/storage";
import {isFromSettingState, pageGlobalState, userAddressesState, userEditingAddressState} from "../../state";
import {Button, Icon, List, Text, useNavigate} from "zmp-ui";
import Container from "../../components/layout/Container";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {Address, AuthData, Branch} from "../../models";
import {useSetHeader} from "../../hooks";
import {useParams} from "react-router-dom";
import {shippingAddressState} from "../../states/cart";
import {authState} from "../../states/auth";
import {HiOutlineLocationMarker} from "react-icons/hi";
import {branchsState} from "../../states/home";

const UserAddresses: React.FunctionComponent = () =>{
    let { from } = useParams();
    const [userAddresses, setUserAddresses] = useRecoilState<Address[]>(
        userAddressesState
    );
    const setErrMsg = useSetRecoilState(pageGlobalState);
    const [userEditingAddress, setUserEditingAddress] = useRecoilState<Address>(
        userEditingAddressState
    );
    const [isFromSetting, setIsFromSetting] = useRecoilState<boolean>(
        isFromSettingState
    );
    const setHeader = useSetHeader();
    const [shippingAddress, setShippingAddress] = useRecoilState<Address>(
        shippingAddressState
    );
    const authDt = useRecoilValue<AuthData>(authState);
    const navigate = useNavigate();
    useEffect(() => {

        setHeader({
            customTitle:  "Quản lý địa chỉ",
            hasLeftIcon: true,
            type: "secondary",
            showBottomBar: true
        });
        const gAddresses= async () => {
            //await saveAddress(uaddresses[0])
            const cachedUserAddresses = await loadAddresses();
            setUserAddresses(cachedUserAddresses);
        }
        gAddresses();
    },[])



    const { Item } = List;
    return (<Container>
        <div
        className="p-0 zui-container-background-color overflow-y-auto max-h-full"
        style={{ marginBottom: "0px" }}

    >
        {(userAddresses) && <List className=" zui-container-background-color py-4">
            {userAddresses.map((address,index) => {
                return (<Item key={`address${index}`}  className={`mb-4 p-4 bg-white`} title={'Địa chỉ'}
                              prefix={<HiOutlineLocationMarker className="mr-2 mt-6 h-5 w-5 inline-block" />}
                              subTitle={address.address}
                              children={<Text className={'zaui-list-item-subtitle'}>{address.name+' '+address.phone}</Text>}
                              onClick={() => {
                                  setUserEditingAddress(address);
                                  navigate('/edit-address/${from}');

                }}
                suffix={<Button variant={`tertiary`} className={"p-0 min-w-0 h-8 w-8 leading-0 rounded-full zui-container-background-color mt-5" } onClick={()=>{
                    setUserEditingAddress(address);
                    navigate('/edit-address/${from}');
                    setIsFromSetting(false)
                }}><Icon icon="zi-edit-text" size={16} /></Button>}/>)
            })}
        </List>}
        <Button className={`h-10  px-0 py-2 w-10/12 border-l-0 border-b-0 mb-20 rounded-full ml-auto mr-auto block`} onClick={async ()=>{
                    setUserEditingAddress({
                        id: 0,
                        name: authDt?.profile?.name,
                        phone: authDt?.profile?.phone,
                        email: authDt?.profile?.email,
                        address: "",
                        notes: "",
                        default: false
                    });
                    navigate(`/edit-address/${from}`);
                         setIsFromSetting(false)

                }}><Icon icon="zi-plus-circle" size={24} /> {`Thêm địa chỉ`}</Button>


    </div></Container>);
}
/*
* <Button variant={`tertiary`} onClick={()=>{
                    setErrMsg(oldMsg => {
                        return {
                            ...oldMsg,
                            confirmModal: {
                                buttons: [
                                    {
                                        label:"Xoá",
                                        type:"danger",
                                        action: ()=>{
                                            setUserAddresses(old => {
                                                return old.filter(oAddress => oAddress.id !== address.id);
                                            });
                                            resetAddress(userAddresses.filter(oAddress => oAddress.id !== address.id));
                                            console.log("OKOKOK")
                                        }
                                    },{
                                        label:"Đóng",
                                        isCLosed: true,
                                        type:"highlight"
                                    }
                                ],
                                showModal:true,
                                title: "Bạn có chắc muốn xoá?",
                                description: "Thao tác này sẽ không thể khôi phục, bạn có chắc muốn làm điều này?",
                            }
                        }
                    })
                }}><Icon icon="zi-delete"  /></Button>
* */
export default UserAddresses;
