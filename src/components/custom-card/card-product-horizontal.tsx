import React from "react";
import { useSetRecoilState } from "recoil";
import { Box, Icon } from "zmp-ui";
import { openProductPickerState, productInfoPickedState } from "../../state";
import { convertPrice } from "../../utils";
import ImageRatio from "../img-ratio";
import { useNavigate } from "react-router-dom";
import {Product} from "../../models";
import {noImage} from "../../utils/constants";

type CardProductHorizontalProps = {
  product: Product;
  imageW?: number;
  canAdd?: boolean;
  padding?: number;
  height?: number;
};
const CardProductHorizontal = ({
  product,
  imageW = 6,
  canAdd = true,
  padding = 0,
  height = 24
}: CardProductHorizontalProps) => {
  const setOpenSheet = useSetRecoilState(openProductPickerState);
  const setProductInfoPicked = useSetRecoilState(productInfoPickedState);
  const navigate = useNavigate();
  const pathImg = (product?.images && product?.images?.length > 0) ? product?.images[0]?.src : noImage;
  return (
    <div
      className={`w-full flex flex-row items-center border border-[#E4E8EC] rounded-xs overflow-hidden h-${height} p-${padding}`}
      role="button"
    >
      <div
        className={`flex-none`}
        style={{width: `${imageW}rem`}}
        onClick={() => {
          navigate(`/detail-product/${product.id}`);
        }}
      >
        <ImageRatio src={pathImg} alt="image product" ratio={1} />
      </div>
      <div
        className=" p-3 pr-0 flex-1"
        onClick={() => {
          navigate(`/detail-product/${product.id}`);
        }}
      >
        <div className="line-clamp-2 text-sm break-words">{product.name}</div>
        <span className=" pt-2 font-semibold text-sm text-primary">
          <span className=" font-normal text-xs text-primary">đ </span>
          {convertPrice(product.price || 0)}
        </span>
      </div>
      <>
        {canAdd == true && <Box
          mx={2}
          flex
          justifyContent="center"
          alignItems="center"
          className="flex-none"
        >
          <div
            className="w-6 h-6 rounded-full bg-primary flex justify-center items-center"
            onClick={() => {
              setProductInfoPicked(info => {
                return {
                  ...info,
                  product,
                  isUpdate: true
                }
              });
              setOpenSheet(true);
            }}
            role="button"
          >
            <Icon icon="zi-plus" size={16} className="text-white" />
          </div>
        </Box>}
      </>
    </div>
  );
};

export default CardProductHorizontal;
