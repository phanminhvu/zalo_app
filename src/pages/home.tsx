import React, {useEffect, useState} from "react";
import {Box, Input, Text} from "zmp-ui";
import {useRecoilState, useRecoilValue} from "recoil";
import {
    branchsState,
    couponsState,
    districtsState,
    homeCategoriesState,
    homeFeaturedProductsState,
    homeProductsState,
    provincesState
} from "../states/home";
import {AuthData, Branch, CartData, Category, Coupon, District, Order, Product, Province} from "../models";
import {useNavigate} from "react-router-dom";
import useSetHeader from "../hooks/useSetHeader";
import {authState} from "../states/auth";

import {loadCartFromCache, loadOrderFromCache, loadUserFromCache, saveUserToCache} from "../services/storage";
import {authorizeV2, getSettingV2} from "../services/zalo";
import ProductCarouselVertical from "../components/carousel/ProductCarouselVertical";
import CardProductVertical from "../components/custom-card/product-vertical";
import Container from "../components/layout/Container";
import CategoriesCarousel from "../components/carousel/CategoriesCarousel";
import {showOAWidget} from "zmp-sdk/apis";
import {cartState, userOrdersState} from "../states/cart";

const HomeMain: React.FunctionComponent = () =>{
    const categories = useRecoilValue<Category[]>(homeCategoriesState);
    const products = useRecoilValue<Product[]>(homeProductsState);
    const featuredProducts = useRecoilValue<Product[]>(homeFeaturedProductsState);
    const provinces = useRecoilValue<Province[]>(provincesState);
    const districts = useRecoilValue<District[]>(districtsState);
    const branchs = useRecoilValue<Branch[]>(branchsState);
    const coupons = useRecoilValue<Coupon[]>(couponsState);
    const [userOrders, setUserOrders] = useRecoilState<Order[]>(
        userOrdersState
    );
    const navigate = useNavigate();
    const setHeader = useSetHeader();
    const [authDt, setAuthDt] = useRecoilState<AuthData>(
        authState
    );
    const [cart, setCart] = useRecoilState<CartData>(
        cartState
    );
    const [loading,setLoading] = useState(false);
    useEffect(() => {
        setHeader({
            customTitle:  "Trang chủ",
            hasLeftIcon: false,
            type: "homeTrans",
            showAvatar: true
        });
        showOAWidget({
            id: "oaWidget",
            guidingText: "Nhận thông báo khuyến mãi mới nhất từ cửa hàng",
            color: "#0068FF",
            onStatusChange: (status) => {
              console.log(status);
            }
          });
    }, []);

    // /*"NODE_TLS_REJECT_UNAUTHORIZED=0 RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED=false zmp start"*/
    useEffect(() => {
        const loginEff = async () => {
            //setLoading(true);
            let userInfo = {};
            userInfo = await loadUserFromCache();
            if(userInfo && userInfo?.id ){
                setAuthDt({
                    ...authDt,
                    profile: userInfo
                });
            }else{
                userInfo = await authorizeV2();
                let zaloSettings = await getSettingV2();
                if(zaloSettings['authSetting']['scope.userInfo'] === true){
                    setAuthDt({
                        ...authDt,
                        profile: userInfo
                    });
                    saveUserToCache(userInfo);
                }
           setAuthDt({
                    ...authDt,
                    profile: {
                        birthday:"",
                        email:"4855948733451676664@zalo.vn",
                        id:26,
                        name:"Ctygram",
                        sex: 0,
                        phone:"",
                        picture:"https://s120-ava-talk.zadn.vn/5/d/5/6/5/120/7fd4d3350d3b52b18958e939d974a026.jpg",
                        zalo_data: {
                            avatar:"https://s120-ava-talk.zadn.vn/5/d/5/6/5/120/7fd4d3350d3b52b18958e939d974a026.jpg",
                            followedOA:false,
                            id:"4855948733451676664",
                            isSensitive:false,
                            name:"Ctygram"
                        },zalo_id: "4855948733451676664"
                    },
                    token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2N0eWdyYW0uY29tIiwiaWF0IjoxNzI3MjAwMDI0LCJuYmYiOjE3MjcyMDAwMjQsImV4cCI6MTcyNzgwNDgyNCwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoyNn19fQ.MuI5JUapLwVev9uUzb4HRhg6CbejV26gQipZ0FaeK30"
                });
            }


           const cachedCart = await loadCartFromCache();
            setCart(cachedCart);
            const cachedOrders = await loadOrderFromCache();
            console.log("Me kiep order ",cachedOrders)
            setUserOrders(cachedOrders);

            /**/
        }
        loginEff();
    },[])
    const handleScroll = (e) => {
        const position = e.target.scrollTop;
        if(position > 20){
            setHeader({
                customTitle:  "Trang chủ",
                hasLeftIcon: false,
                type: "home",
                showAvatar: true
            });
        }else{
            setHeader({
                customTitle:  "Trang chủ",
                hasLeftIcon: false,
                type: "homeTrans",
                showAvatar: true
            });
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <Container className={""} onScroll = {handleScroll}>
            <div
                className="p-0 pb-[80px] zui-container-background-color"
                style={{ marginBottom: "0px" }}

            >
            <div className={' relative px-4 pb-3 bg-white leading-none  items-top justify-start'}>
                <div>
                    <Input.Search
                        label=""
                        helperText=""
                        loading={false}
                        placeholder="Tìm nhanh món ăn, thức uống..."
                        className="text-sm"
                        onInputTriggerClick={() => {
                            navigate(`/search`)
                        }}
                        size={'medium'}
                        readOnly
                    />
                </div>
                <div className="mt-4">
                    <img
                        style={{ width: "100%", height: "190px", objectFit: "cover",borderRadius:"8px" }}
                        role='presentation'
                        onClick={() => {
                        }}
                        src={'https://ctygram.com/wp-content/uploads/2024/09/nem_banner.jpg'}
                        alt={''}
                        />

                </div>
                <div className="mt-6">
                    {(categories) && <CategoriesCarousel categories={categories?.filter(cat => cat.parent === 0)} />}
                </div>
            </div>

              {(featuredProducts) && <Box
                  m={0}
                  px={4}
                  py={4}
                  className="bg-white leading-none  items-top justify-start mt-2 productcarousefull"
              >
                <Text bold size={'large'} className={`mb-2`}>{`Đang có ưu đãi`}</Text>
                <ProductCarouselVertical products={featuredProducts}/>
            </Box>}
            <Box
                  m={0}
                  px={4}
                  py={5}
                  className="bg-white leading-none  items-top justify-start mt-4"
              >
                <div id='oaWidget' />
              </Box>

                {(products) && <Box m={0}
                  px={4}
                  py={4} className="bg-white leading-none  items-top justify-start mt-2">
                    <Text bold size={'large'} className={`mb-2`}>{`Danh sách sản phẩm`}</Text>
                    <section className="w-fit mx-auto grid grid-cols-2 gap-3 mb-5">
                        {products && products.map((product) => (
                            <CardProductVertical product={product} key={product.id} canAdd={true} grid/>
                        ))}
                    </section>
                </Box>}
            </div>
        </Container>
    )
}
export default HomeMain;
