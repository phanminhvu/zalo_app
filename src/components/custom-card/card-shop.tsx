import React from "react";
import { Button, Icon } from "zmp-ui";
import { StoreLite } from "../../models";
import { getConfig } from "../config-provider";
import { DEFAULT_OA_ID } from "../../constants";
import { openChat } from "zmp-sdk";
// import {Avatar} from "zmp-framework/react";
import {useNavigate} from "react-router-dom";

const CardShop = ({ storeInfo }: { storeInfo: StoreLite }) => {
    const navigate = useNavigate();
  const handleOpenChat = () => {
    const oaId: string = getConfig((c) => c.template.oaIDtoOpenChat || "");

    openChat({
      type: "oa",
      id: oaId || DEFAULT_OA_ID,
    });
  };
    const addressObj = storeInfo?.address ? Object.entries(storeInfo?.address).map(x=>{
        return (x && x[1]) ? x[1] : "";
    }).join("\n") : "";
    /*style={{backgroundImage: `url(${storeInfo?.banner ? ''+storeInfo?.banner+'' : ``})`,backgroundRepeat:'none',backgroundSize:'cover'}}*/
  return (
    <div className={`flex flex-row justify-between bg-white `} >
      {storeInfo && (
        <div className="flex flex-row ">
          {/* <Avatar src={storeInfo.gravatar} size={24} className={`rounded-full`}></Avatar> */}
          <div className=" pl-4">
            <div className=" text-base font-medium pb-1">
              {storeInfo.store_name}
            </div>
              {/*<div className=" text-sm font-normal text-gray-500 pb-1">
              0 theo dõi
            </div>*/}
            <div className=" flex flex-row text-sm font-normal  text-gray-500">
              <div className="flex items-center justify-center">
                <Icon icon="zi-location-solid" size={12} />
              </div>
              <div className=" pl-1">{addressObj}</div>
            </div>
          </div>
        </div>
      )}
      <Button
        className="chat-button text-xs p-1"
        variant="secondary"
        size="small"
        onClick={() => {
            navigate(`/store-detail/${storeInfo.id}`);
        }}

      >
        Xem shop
      </Button>
    </div>
  );
};

export default CardShop;
