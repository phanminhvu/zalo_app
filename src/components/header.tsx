import React from "react";
import { cx } from "../utils";
import {Avatar, Box, Icon, Input, Text, useNavigate,Button} from "zmp-ui";
import {useRecoilState, useRecoilValue} from "recoil";
import { headerState } from "../state";
import {HiShoppingCart,HiSearch} from "react-icons/hi";
import {AuthData} from "../models";
import {authState} from "../states/auth";

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
    headerColor: "bg-transparent",
    textColor: "text-black",
    iconColor: "text-black",
    size: 20
  },
};

const Header = () => {
  const { route, hasLeftIcon, rightIcon, title, customTitle, type , showAvatar, showSearch,onSearchChange,showCart,
    onSearchButtonClick} =
    useRecoilValue(headerState);
  const [authDt, setAuthDt] = useRecoilState<AuthData>(
      authState
  );
  const { headerColor, textColor, iconColor, size } = typeColor[type! || "primary"];
  const navigate = useNavigate();

  return (
    <div
      className={cx(
        "fixed top-0 z-50 w-screen h-header flex items-center",
        headerColor,
        textColor
      )}
    >
      <div className=" flex items-start px-4 w-full justify-between">

        {showAvatar && <Box flex py={0}>
          <Avatar size={36} src={authDt.profile.avatar}/>
          <div className={"ml-4"}>
            <Text bold size={'small'}>{authDt.profile.name}</Text>
            <Text size={'xxSmall'} >{`Ngày mới tốt lành `}</Text>
          </div>
        </Box>}
        {!showAvatar && <div className="w-full flex flex-row items-center pr-14 truncate ...">
          {hasLeftIcon && (
            <span onClick={() => (route ? navigate(route) : navigate(-1))}>
              <Icon icon="zi-arrow-left" className={iconColor} size={size} />
            </span>
          )}
          {showSearch && <Box py={0} className={"w-full"}>
            <div className={'rounded-lg border border-slate-200'}>
              <Input
                  label=""
                  helperText=""
                  placeholder="Tìm kiếm"
                  className="w-full border-0 m-0"
                  size={'medium'}
                  onChange={onSearchChange}
              />
            </div>

          </Box>}
          {customTitle ? customTitle : title}
        </div>}
        {rightIcon || " "}
        {showCart && <div
            onClick={() =>{
              navigate(`/cart`);
            } }
        >
          <HiShoppingCart className="mr-2 h-5 w-5" />
        </div>}
      </div>
    </div>
  );
};

export default Header;
