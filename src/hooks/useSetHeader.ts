import {useSetRecoilState} from "recoil";
import {HeaderType} from "../models";
import appConfig from "../../app-config.json";
import {headerState} from "../state";
import {useCallback} from "react";

const useSetHeader = () => {
  const setHeader = useSetRecoilState(headerState);
  return useCallback(
    ({
      route = "",
      hasLeftIcon = true,
      rightIcon = null,
      title = appConfig.app.title,
      customTitle = null,
      type = "primary",
        showBottomBar = true,
         showAvatar = false,
        showSearch = false,
        onSearchChange = null,
        showCart = false,
         showTotalCart = false,
        onSearchButtonClick = null
    }: HeaderType) =>
      setHeader({
        route,
        hasLeftIcon,
        rightIcon,
        title,
        customTitle,
        type,
          showBottomBar,
          showAvatar,
          showSearch,
          onSearchChange,
          showCart,
          showTotalCart,
          onSearchButtonClick
      }),
    [setHeader]
  );
};

export default useSetHeader;
