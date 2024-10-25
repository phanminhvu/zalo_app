import React from "react";
import {cx} from "../utils";
import {Avatar, Box, Icon, Input, Text, useNavigate, Button} from "zmp-ui";
import {useRecoilState, useRecoilValue} from "recoil";
import {headerState, isFromSettingState, isMappingState} from "../state";
import {HiShoppingCart, HiSearch} from "react-icons/hi";
import {AuthData} from "../models";
import {authState} from "../states/auth";
import {addressAutoState} from "../states/cart";

const typeColor = {
    primary: {
        headerColor: "bg-primary",
        textColor: "text-white",
        iconColor: "text-white",
        size: 20
    },
    secondary: {
        headerColor: "bg-white",
        textColor: "text-black",
        iconColor: "text-black",
        size: 20
    },
    home: {
        headerColor: "bg-white/60",
        textColor: "text-black",
        iconColor: "text-black",
        size: 20
    },
    homeTrans: {
        headerColor: "bg-white/0",
        textColor: "text-black",
        iconColor: "text-black",
        size: 20
    },
};


const Header = () => {
    const {
        route, hasLeftIcon, rightIcon, title, customTitle, type, showAvatar, showSearch, onSearchChange, showCart,
        onSearchButtonClick
    } =
        useRecoilValue(headerState);
    const [authDt, setAuthDt] = useRecoilState<AuthData>(
        authState
    );
    const {headerColor, textColor, iconColor, size} = typeColor[type! || "primary"];
    const navigate = useNavigate();
    const [isMapping, setIsMapping] = useRecoilState<boolean>(
        isMappingState
    );

    const [isFromSetting, setIsFromSetting] = useRecoilState<boolean>(
        isFromSettingState
    );
    const [addressAuto, setAddressAuto] = useRecoilState<boolean>(
        addressAutoState
    );


    const editAddress = customTitle ===  "Tin tức" || customTitle ===   "Giỏ hàng" || customTitle ===   "Trang cá nhân"  || customTitle ===   "Tìm kiếm" || customTitle ===   "Danh mục"





    return (
        <div
            className={cx(
                "fixed top-0 z-50 w-screen h-header flex items-center bg-white",

                textColor
            )}
        >
            <div className="flex flex-col w-full px-4">
                <div className="flex items-center justify-between w-full">
                    {showAvatar && <Box flex py={0}>
                        <Avatar size={36} src={authDt.profile.avatar}/>
                        <div className={"ml-4"}>
                            <Text bold size={'small'}>Xin chào, {authDt.profile.name}</Text>
                            <Text size={'xxSmall'}>Chúc ngày mới tốt lành!</Text>
                        </div>
                    </Box>}
                    {!showAvatar &&
                        <Text bold className={`${showSearch ? 'mt-10' : ''}`} size={'xLarge'}>
                            {hasLeftIcon && (
                                editAddress ?
                                    <Icon icon="zi-home" style={{marginBottom: "4px"}}
                                          onClick={() => {
                                              setIsMapping(false);
                                              setAddressAuto(false);
                                              navigate('/')
                                          }}
                                          className={iconColor} size={25}/> :
                                    <Icon icon="zi-chevron-left" style={{marginBottom: "4px"}} onClick={() => {

                                        setAddressAuto(false);
                                        if (isMapping) {
                                            setIsMapping(false)
                                            navigate('/cart')
                                        }else {
                                            if(isFromSetting) {
                                                navigate('/my-profile')
                                                setIsFromSetting(false)
                                            }
                                            else {
                                                setIsMapping(false)
                                                navigate('/my-addresses/profile')
                                            }

                                        }
                                    }
                                    } className={iconColor} size={25}/>

                            )}
                            <span className='ml-4'>
                  {customTitle ? customTitle : title}
                </span>
                        </Text>
                    }
                </div>


                {showSearch && <Box py={0} className={"w-full"}>
                    <div className={'rounded-lg border mt-3 border-slate-200'}>
                        <Input.Search
                            label=""
                            helperText=""
                            placeholder="Tìm kiếm"
                            className="w-full border-0 m-0"
                            size={'medium'}
                            onChange={onSearchChange}
                        />
                    </div>

                </Box>}
                {rightIcon || " "}

                {showCart && <div
                    onClick={() => {
                        navigate(`/cart`);
                    }}
                >
                    <HiShoppingCart className="mr-2 h-5 w-5"/>
                </div>}

            </div>
        </div>
    );
};

export default Header;