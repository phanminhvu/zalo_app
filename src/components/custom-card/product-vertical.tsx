import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Icon , Button} from "zmp-ui";
import {  openProductPickerState, productInfoPickedState } from "../../state";
import { convertPrice } from "../../utils";
import ImageRatio from "../img-ratio";
import { useNavigate } from "react-router-dom";
import {Product, ProductInfoPicked} from "../../models";
import {noImage} from "../../utils/constants";
import { cartState } from "../../states/cart";

type CardProductVerticalProps = {
    product: Product;
    canAdd?: boolean;
    padding?: number;
    showAdd?: boolean;
    grid?: boolean;
};
const CardProductVertical = ({
                                   product,
                                   canAdd ,
                                   padding = 0,
                                 grid=false
                               }: CardProductVerticalProps) => {
    const setOpenSheet = useSetRecoilState(openProductPickerState);
    const setProductInfoPicked = useSetRecoilState(productInfoPickedState);

    const navigate = useNavigate();
    const cart = useRecoilValue(cartState);
    const pathImg = (product?.image ) ? product?.image  : noImage;
    return (
        <div className={`${grid ? '' : 'mr-3'} bg-white rounded-lg duration-500  `} onClick={() => {
            //navigate(`/detail-product/${product.id}`);
            setProductInfoPicked(info => {
                return {
                    ...info,
                    product,
                    isBuyNow: false,
                    currentItem: cart?.cartItems?.some(cItem=>cItem.product_id === product.id) ? cart?.cartItems?.find(cItem=>cItem.product_id === product.id) : null
                } as ProductInfoPicked
            });
            setOpenSheet(true);
        }}>
                <img
                    src={pathImg}
                    alt={product.name} className="w-full aspect-auto rounded-lg "/>
            <div className="flex px-3 py-2">
                {/*} <span className="text-gray-400 mr-3 uppercase text-xs">Brand</span>*/}
                <div className={"flex-1"}>
                    <p className="text-sm text-black font-roboto">{product.name}</p>
                    {(parseFloat(product.sale_price) > 0 || (parseFloat(product.price) > 0)) && (
                        <div className="flex items-center">
                            {(product.on_sale == 1 && product.sale_price > 0) && (
                                <del className="mr-2">
                                    <p className="text-xs text-gray-600 cursor-auto font-roboto">
                                        {convertPrice(product.price || 0)}đ
                                    </p>
                                </del>
                            )}
                            <p className="text-xs text-sky-800 cursor-auto font-roboto font-[570]">
                                {convertPrice((product.on_sale == 1 && product.sale_price > 0) ? product.sale_price : product.price)}đ
                            </p>
                        </div>
                    )}
                </div>
                {canAdd && <div className="mr px-0 py-0 min-w-0 w-[20px] h-[20px]">
               <Icon icon="zi-plus-circle-solid" className="text-[#1677ff]" size={25}  />
                    </div>}
                {/*{canAdd && <span className=" px-0 py-0 min-w-0 w-[20px] h-[20px]">*/}
                {/*        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"*/}
                {/*             fill="currentColor" className="bi bi-bag-plus" viewBox="0 0 16 16">*/}
                {/*            <path fillRule="evenodd"*/}
                {/*                  d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"/>*/}
                {/*            <path*/}
                {/*                d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>*/}
                {/*        </svg>*/}
                {/*    </span>}*/}
            </div>
        </div>
    )
}
export default CardProductVertical;
