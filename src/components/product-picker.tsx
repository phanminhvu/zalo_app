import React, { useEffect, useMemo, useRef, useState } from "react";

import { createPortal } from "react-dom";
import ImageRatio from "../components/img-ratio";
import {CartProduct, Product, ProductInfoPicked} from "../models";
import ButtonFixed from "../components/button-fixed/button-fixed";
import cx from "../utils/cx";
import { convertPrice } from "../utils";
import { Box, Button, Icon, Input, Radio, Sheet, Text ,Checkbox} from "zmp-ui";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  openProductPickerState, pageGlobalState,
  productInfoPickedState,
  storeState,
} from "../state";
import { useAddProductToCart ,useResetProductPicked} from "../hooks";
import { useNavigate } from "react-router-dom";
import { Toast } from 'flowbite-react';
import {homeProductsState} from "../states/home";
import { cartState } from "../states/cart";
import {saveCartToCache} from "../services/storage";

const ProductPicker = () => {
  const { product, isBuyNow ,currentItem} = useRecoilValue(productInfoPickedState);
  const setProductInfo = useSetRecoilState(productInfoPickedState);
  const setErrMsg = useSetRecoilState(pageGlobalState)
  const [openSheet, setOpenSheet] = useRecoilState<boolean>(
    openProductPickerState
  );
  const products = useRecoilValue<Product[]>(homeProductsState);
  const [quantity, setQuantity] = useState<number>(1);
  const [relateItems, setRelateItems] = useState<CartProduct[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, any> | undefined
  >(undefined);
  const [note, setNote] = useState("");
  const [cart, setCart] = useRecoilState(cartState);
  const btnRef = useRef<HTMLDivElement | null>(null);
  const store = useRecoilValue(storeState);
  const sheet = useRef<any>(null);

  const resetProductPicker = useResetProductPicked();
  const addProductToCart = useAddProductToCart();
  const navigate = useNavigate();
  const resetOptions = () => {
    setQuantity(1);
    setNote("");
  };
  useEffect(()=> {
    if(currentItem && product && currentItem?.product_id == product.id) {
      const nRelatedItems = cart?.cartItems?.filter(crItem => crItem.parent === currentItem?.product_id);
      setRelateItems(nRelatedItems);
      setQuantity(currentItem?.quantity);
    }else{
      setRelateItems([]);
    }
  },[product,currentItem])
  const noteComponent = useMemo(
    () => (
      <>
        <Text className="text-sm text-black">Ghi chú</Text>
        <div className="mb-[2rem]">
          <Input
            type="text"
            size={"small"}
            placeholder="Nhập thông tin ghi chú..."
            clearable
            name="note"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        </div>
      </>
    ),
    [note]
  );

  const buttonAdd = () => {
    let button = <></>;
    if(cart?.cartItems?.some(cI =>cI.product_id === product.id) ){
      if(quantity === 0) {
        button =  <Button
           style={{backgroundColor: '#f0f0f0', color: '#000'}}
            size="medium"
            onClick={
              async ()=>{
                await setCart((oldCart)=>{
                  let nCart = { ...oldCart };
                  nCart.cartItems = nCart.cartItems.filter(item => (item.product_id !== product.id && item.parent !== product.id))
                  nCart.totalCart = 0;
                  if(nCart.cartItems && nCart.cartItems?.length > 0){
                    nCart.cartItems.map((cItem,cIndex) => {
                      const aPrice = (cItem?.sale_price && cItem?.sale_price > 0 ) ? Number(cItem.sale_price) * cItem.quantity : Number(cItem.price) * cItem.quantity;
                      nCart.totalCart += aPrice;
                    });
                  }
                  saveCartToCache(nCart);
                  return nCart;
                })

                setOpenSheet(false);
              }
            }
        >
          {`Xóa khỏi giỏ hàng`}
        </Button>
      }else {
        button =  <Button
            disabled={quantity == 0}
            variant={'primary'}
            size="medium"
            onClick={
              ()=>{
                if(quantity > 0){
                  addProductToCart({
                    productCart: {
                      product_id: product.id,
                      name:  product.name,
                      image: product.image,
                      price: product.price ,
                      sale_price: product.sale_price,
                      quantity,
                      parent: 0,
                      user_note: note
                    } as CartProduct,
                    isEdit: currentItem && product && currentItem?.product_id == product.id,
                    childProductCarts: relateItems
                  });
                  setOpenSheet(false);
                }else{
                  setErrMsg(oldMsg => {
                    return {
                      ...oldMsg,
                      errMsg: "Bạn cần thêm số lượng cần mua"
                    }
                  })
                }
              }
            }
        >
          {`Cập nhật giỏ hàng`}
        </Button>
      }
    } else {
      button = <Button
          disabled={quantity == 0}
          variant={'primary'}
          size="medium"
          onClick={
            ()=>{
              if(quantity > 0){
                addProductToCart({
                  productCart: {
                    product_id: product.id,
                    name:  product.name,
                    image: product.image,
                    price: product.price ,
                    sale_price: product.sale_price,
                    quantity,
                    parent: 0,
                    user_note: note
                  } as CartProduct,
                  isEdit: currentItem && product && currentItem?.product_id == product.id,
                  childProductCarts: relateItems
                });
                setOpenSheet(false);
              }else{
                setErrMsg(oldMsg => {
                  return {
                    ...oldMsg,
                    errMsg: "Bạn cần thêm số lượng cần mua"
                  }
                })
              }
            }
          }
      >
        {`Thêm vào giỏ hàng`}
      </Button>
    }

    return button
  }


  console.log("product",product)
  return (
    <>
      {product && (
        <Sheet
          mask
          visible={openSheet}
          swipeToClose
          maskClosable
          onClose={() => setOpenSheet(false)}
          afterClose={() => {
            resetProductPicker();
            resetOptions();
          }}
          ref={sheet}
          autoHeight
          title=""
        >

          <div className="overflow-y-auto overflow-x-hidden pb-32 px-5 ">
            <div className="w-full  items-center justify-between overflow-hidden">
              <div className="items-center">
                <div className="flex-none">
                  <div
                      className={`"w-full relative"`}
                  >
                    <img
                        src={product?.image ? product?.image : ""}
                        alt={"image product"}
                        className={`w-full  top-0 left-0 object-cover rounded-lg`}
                    />
                  </div>
                </div>
                <div className=" py-[2rem] pr-0">
                  <div className="text-base text-black break-words font-bold font-lato">
                    {product.name}
                  </div>
                  <div className="items-center ">
                    {(product.on_sale && product.sale_price) ? <del className="mr-2">
                      <p className="text-xs text-slate-400 font-lato">{convertPrice(product.price || 0)}đ</p>
                    </del> : ''}
                    <p className="text-sm font-lato text-black ">
                      {convertPrice((product.on_sale == 1 && product.sale_price > 0) ? product.sale_price : product.price)}đ
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {noteComponent}
            {(product?.related_products && product?.related_products?.length > 0 ) && <Box    >
              <Text bold size={'large'} className={`mb-2`}>{`Đồ Ăn Thêm - Mua Kèm Giá Tốt`}</Text>
              {(products?.filter(rlItem => (product?.related_products?.includes(rlItem.id)))?.length > 0 ) && products?.filter(rlItem => (product?.related_products?.includes(rlItem.id)))?.map((rrItem,rindex) => {
                return (<div key={`prpick_${rindex}`} className={"flex mb-1"}>
                  <Checkbox  value={rrItem.id} onChange={(e) => {
                    setRelateItems(old => {
                      const others = old.filter(oItem => oItem.product_id !== rrItem.id)
                      const editingItem = {
                        product_id: rrItem.id,
                        name:  rrItem.name,
                        image: rrItem.image,
                        price: rrItem.price ,
                        sale_price: rrItem.sale_price,
                        quantity,
                        parent: product.id
                      };
                      if(e.target.checked){
                        return (others && others?.length > 0) ? [...others,editingItem] : [editingItem]
                      }else{
                        return others
                      }
                    })
                  }}  checked={relateItems?.some(rlItem => (rlItem.product_id === rrItem.id) )}/><Text className={"flex-1 pl-2"}>{rrItem.name}</Text>
                </div>)
              })}
            </Box>}

            <div className="flex title-type-picker absolute left-0 bottom-0 h-24 w-full border-t border-gray-400  py-0 items-center" >
              <Box mx={4}  flex className="flex-1" >
                <Button
                    variant="tertiary"
                    size="medium"
                    icon={
                      <Icon icon="zi-minus-circle-solid" className="text-[#00884880]" size={27}  />
                    }
                    onClick={() => {
                      if (quantity > 0) setQuantity((q) => q - 1);
                    }}
                />
                <Text className="mx-7 mt-1 font-bold qtytext">{quantity}</Text>
                <Button
                    variant="tertiary"
                    size="medium"
                    icon={  <Icon icon="zi-plus-circle-solid" className="text-[#00884880]" size={27}  />}
                    onClick={() => setQuantity((q) => q + 1)}
                />

              </Box>
              {buttonAdd()}
            </div>

          </div>
        </Sheet>
      )}
    </>
  );
};

export default ProductPicker;
