// import React, {useEffect, useMemo, useState} from "react";
// import {Product, ProductInfoPicked, ProductReview} from "../models";
// import { calcSalePercentage, convertPrice } from "../utils";
// import ButtonFixed, {
//   ButtonType,
// } from "../components/button-fixed/button-fixed";
// import {Box, Icon, Page, Text} from "zmp-ui";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import {
//   cartState,
//   cartTotalPriceState,
//   openProductPickerState,
//   productInfoPickedState,
//   storeState
// } from "../state";
// import {detailProductState} from "../states/product"
// import { useParams, useNavigate } from "react-router-dom";
// import { changeStatusBarColor } from "../services";
// import useSetHeader from "../hooks/useSetHeader";
// import { openShareSheet } from "zmp-sdk";
// import WooWorker from "../services/WooWorker";
// import {renderHTML} from "../utils/functions";
// import ProductDescription from "../components/product/ProductDescription";
// import CardShop from "../components/custom-card/card-shop";
// import ImageCarousel from "../components/carousel/ImageCarousel";
// import ProductCarousel from "../components/carousel/ProductCarousel";
// import ProductRating from "../components/product/ProductRating";
// import DokanWorker from "../services/DokanWorker";
// import { Button } from "flowbite-react";
// import {HiOutlineArrowRight, HiOutlineShoppingBag, HiShoppingCart} from 'react-icons/hi';
// import Container from "../components/layout/Container";

// const DetailProduct = () => {
//   const storeInfo = useRecoilValue(storeState);
//   const setStoreInfo = useSetRecoilState(storeState)
//   const cart = useRecoilValue(cartState);
//   const totalPrice = useRecoilValue(cartTotalPriceState);
//   let { productId } = useParams();
//   const setOpenSheet = useSetRecoilState(openProductPickerState);
//   const setProductInfoPicked = useSetRecoilState(productInfoPickedState);
//   const navigate = useNavigate();
//   const setHeader = useSetHeader();
//   const [product, setProduct] = useState<Product>();
//   const [storeProducts, setStoreProducts] = useState<Product[]>();
//   const [reviews, setReviews] = useState<ProductReview[]>();

//     useEffect(() => {
//       if (productId) {
//         WooWorker.detailProductById(productId).then((res) => {
//           setProduct(res);
//         });
//         WooWorker.reviewsByProductId(productId).then((res) => {
//             setReviews(res);
//         });
//       }
//     }, [productId]);
//     useEffect(() => {
//         if(product && product?.id > 0 && product?.store?.id > 0){
//             DokanWorker.getStoreProducts(product?.store?.id, 10,1).then((res) => {
//                 setStoreProducts(res);
//             });
//             setHeader({
//                 customTitle:  product.name,
//                 hasLeftIcon: true,
//                 type: "secondary",
//                 showBottomBar: false,
//                 showCart: true
//             });
//         }
//     }, [product]);

//     const handleShare = () => {
//       /*openShareSheet({
//         title: `${product?.name}`,
//         text: `${product?.name}`,
//         url: `${window.location.origin}/product/${productId}`,
//       });*/
//     };

//     const handleAddToCart = () => {
//       if (product) {
//           setOpenSheet(true);
//         /*if (cart.find((item) => item.id === product.id)) {

//         } else {
//           WooWorker.addToCart(product.id).then((res) => {
//             setOpenSheet(true);
//           });
//         }*/
//       }
//     };
//   const salePercentage = useMemo(
//     () => calcSalePercentage(product?.sale_price!, product?.regular_price!),
//     [product]
//   );

//   const btnCart: ButtonType = useMemo(
//     () => ({
//       id: 1,
//       content: "Thêm vào giỏ",
//       type: "primary",
//       onClick: () => {
//           console.log("OK clicked")
//         setOpenSheet(true);
//        // setProductInfoPicked({ productId: Number(productId), isUpdate: true });
//       },
//     }),
//     [product,productId]
//   );

//   const btnPayment: ButtonType = useMemo(
//     () => ({
//       id: 2,
//       content: "Thanh toán",
//       type: "secondary",
//       onClick: () => {
//         navigate("/finish-order");
//       },
//     }),
//     [cart]
//   );

//   const listBtn = useMemo<ButtonType[]>(
//     () => (totalPrice > 0 ? [btnPayment, btnCart] : [btnCart]),
//     [totalPrice, btnCart, btnPayment]
//   );
// /*
//   useEffect(() => {
//           setHeader({
//               title: "",
//               rightIcon: (
//                   <div
//                       onClick={() =>
//                           openShareSheet({
//                               type: "zmp",
//                               data: {
//                                   path: "/",
//                                   title:  product?.name || "",
//                                   description: (product?.description) ? product?.description.slice(0, 100): "",
//                                   thumbnail: product?.images ? product?.images[0]?.src : "",
//                               },
//                           })
//                       }
//                   >
//                       <Icon icon="zi-share-external-1" />
//                   </div>
//               ),
//           });
//           changeStatusBarColor();

//   }, []);*/
//   // @ts-ignore
//     return product ? (
//     <Container>
//       <div
//         className=" relative bg-white w-full"
//         style={{ paddingBottom: totalPrice > 0 ? "120px" : "120px" }}
//       >
//         {product && (
//           <>
//           {(product && product?.images && product?.images?.length > 0) && <ImageCarousel images={product?.images}/>}
//             {(salePercentage > 0) && (
//               <div className="absolute top-2.5 right-2.5 text-white font-medium text-sm px-2 py-1 bg-[#FF9743] w-auto h-auto rounded-lg">
//                 -{`${salePercentage} %`}
//               </div>
//             )}
//               {(product?.sale_price && product?.regular_price ) && <Box m={0} p={4} className="border-b">
//               <div className=" text-lg">{product?.name}</div>
//               <span className=" pt-1 font-semibold text-base text-primary">

//                 {convertPrice(product?.sale_price || 0)}
// 	              <span className=" font-normal text-xs text-primary pl-1">đ</span>
//               </span>
//               <span className=" pl-2 pt-1 font-medium text-sm text-zinc-400">
//                 {convertPrice(product?.regular_price || 0)} đ
//               </span>
//             </Box>}
//               {(!product?.sale_price || !product?.regular_price ) && <Box m={0} p={4} className="border-b">
// 		          <div className=" text-lg">{product?.name}</div>
// 		          <span className=" pt-1 font-semibold text-base text-primary">
//                 <span className=" font-normal text-xs text-primary">đ</span>
//                       {convertPrice(product?.price || 0)}
//               </span>
// 	          </Box>}
//           {product?.variation_products && <Box m={0} p={4} className="border-b">
//             <Text className=" text-medium font-semibold mb-2">{`Chọn loại sản phẩm`}</Text>
// 	          <div className="grid gap-4 grid-cols-3 grid-rows-1" onClick={()=>{
//               //Open addtocart
//             }}>
// 		          <div className="p-2 shadow-lg rounded-lg">
// 			          <Text size={'xxSmall'} className={`text-neutral-400 text-center`}>{product?.variation_products[0]?.attributes_arr[0]?.slug}</Text>
// 		          </div>
//                   {product?.variation_products?.length > 1 && <div className="p-2 bg-slate-50 shadow-lg rounded-lg ">
// 	                  <Text size={'xxSmall'} className={`text-neutral-400 text-center`}>{product?.variation_products[1]?.attributes_arr[0]?.slug}</Text>
// 		          </div>}
//                   {product?.variation_products?.length > 2 && <div className="flex p-2 bg-slate-50 shadow-lg rounded-lg justify-items-center align-items-center">
//                       <Text size={'xxSmall'} className={`text-neutral-400 text-center `}>+2</Text>
// 		          </div>}
// 	          </div>
//            </Box>}
//             <Box
//                   m={0}
//                   px={4}
//                   py={5}
//                   className=" text-justify break-words whitespace-pre-line"
//               >
//                 <Text className=" text-medium font-semibold mb-2">{`Sản phẩm cùng Shop`}</Text>
//                 {(storeProducts && storeProducts?.length > 0) && <ProductCarousel products={storeProducts}/>}
//             </Box>
//             <Box m={0} p={4} className="border-b">
//               <CardShop storeInfo={product?.store} />
//             </Box>
//             <Box
//                   m={0}
//                   px={4}
//                   py={5}
//                   className=" text-justify break-words whitespace-pre-line"
//               >
//                 <Text className=" text-medium font-semibold mb-2">{`Chi tiết sản phẩm`}</Text>
//                 <ProductDescription text={product?.description || ""} height={220}/>
//             </Box>
//             {reviews && <Box
//                   m={0}
//                   px={4}
//                   py={5}
//                   className=" text-justify break-words whitespace-pre-line"
//               >
// 	          <Text className=" text-medium font-semibold mb-2">{`Đánh giá`}</Text>
//               {reviews.map((review,rindex) => {
//                   return rindex < 2 ? (<ProductRating key={"r"+rindex} item={review}/>) : null
//               })}
//             </Box>}
//           </>
//         )}
//       </div>

//       {/*!!totalPrice && (
//         <ButtonPriceFixed
//           quantity={cart.listOrder.length}
//           totalPrice={totalPrice}
//           handleOnClick={() => navigate("/finish-order")}
//         />
//       )}
//       <ButtonFixed listBtn={listBtn} />*/}
//         <div className="flex w-full fixed bottom-[60px] p-4 bg-white"><Text size={"large"} bold >Tổng tiền: </Text><Text size={"xLarge"} bold className={"text-primary ml-1"}>{(product?.sale_price && product?.regular_price ) ? `${convertPrice(product?.sale_price || 0)} đ` : `${convertPrice(product?.regular_price || 0)} đ`}</Text></div>
//         <Button.Group className={`flex w-full fixed bottom-0 h-[60px]`}>
//             <Button className={`flex-1 border-l-0 border-b-0 rounded-none bg-pink-900  h-[60px]`} onClick={()=>{
//                 setProductInfoPicked(info => {
//                     return {
//                         ...info,
//                         product,
//                         isBuyNow: false
//                     } as ProductInfoPicked
//                 });
//                 setOpenSheet(true);
//             }}>
//                 <HiShoppingCart className="mr-2 h-5 w-5" />
//                 <p>
//                     Thêm giỏ hàng
//                 </p>
//             </Button>
//             <Button className={`flex-1 border-l-0 border-r-0 border-b-0 rounded-none  h-[60px]`} onClick={()=>{
//                 setProductInfoPicked(info => {
//                     return {
//                         ...info,
//                         product,
//                         isBuyNow: true
//                     } as ProductInfoPicked
//                 });
//                 setOpenSheet(true);
//             }}>
//                 <HiOutlineShoppingBag className="mr-2 h-5 w-5" />
//                 <p>
//                     Mua ngay
//                 </p>
//             </Button>
//         </Button.Group>
//     </Container>
//   ) : <Page></Page>;
// };

// export default DetailProduct;
