import React from "react";
import { useSetRecoilState } from "recoil";
import { Box, Icon ,Text, Button} from "zmp-ui";
import { convertPrice } from "../../utils";
import ImageRatio from "../img-ratio";
import { useNavigate } from "react-router-dom";
import {NewItem} from "../../models";
import {noImage} from "../../utils/constants";

type CardNewsVerticalProps = {
    newItem: NewItem;
    padding?: number;
    grid?: boolean;
};
const CardNewsVertical = ({newItem,padding = 0,grid=false}: CardNewsVerticalProps) => {
    const navigate = useNavigate();
    const pathImg = noImage;//(newItem?.images && newItem?.images?.length > 0) ? newItem?.images[0]?.src : noImage;
    return (
        <div className={ `bg-white  duration-500 border-b border-slate-200  mt-4 pb-4`} onClick={() => {
            navigate(`/detail-new/${newItem?.id}`);
        }}>
            <div className="flex flex-row">
                <div className="basis-1/4">
                    <img src={ newItem?.image} />
                </div>
                <div className="basis-3/4">
                    <Text className={`text-base font-bold`}>{newItem?.title}</Text>
                    <Text className={`text-sm mt-2`}>{newItem?.short_content}</Text>
                </div>

            </div>
        </div>
    )
}
export default CardNewsVertical;
