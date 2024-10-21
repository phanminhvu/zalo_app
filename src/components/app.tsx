import React, {useState} from "react";
import {Route} from "react-router-dom";
import {AnimationRoutes, App, SnackbarProvider, ZMPRouter} from "zmp-ui";

import {RecoilRoot} from "recoil";
import ProductPicker from "./product-picker";
import Header from "./header";
import {ConfigProvider, getConfig} from "./config-provider";
import {hexToRgb} from "../utils";
import HomeMain from "../pages/home";
import UserCart from "../pages/ecommerce/cart";
import OrderSummaries from "../pages/ecommerce/order-summaries";
import BottomNav from './BottomNav';
import ShippingMethods from "../pages/ecommerce/shippingmethods";
import PaymentMethods from "../pages/ecommerce/paymentmethods";
import WaitingPayment from "../pages/ecommerce/waiting-payment";
import NewDetail from "../pages/NewDetail";

import Orders from "../pages/ecommerce/orders";
import UserProfile from "../pages/user/profile";
import CategoriesPage from "../pages/categories";
import SearchPage from "../pages/search";
import CouponsPage from "../pages/ecommerce/coupons";
import UserInfo from "../pages/user/Info";
import NewsPage from "../pages/news";
import CheckoutNav from "./checkoutnav";
import ProductsPicker from "./products-picker";
import StoresPicker from "./stores-picker";
import UserAddresses from "../pages/user/addresses";
import UserEditAddress from "../pages/user/userEditAddress";
import CouponsPicker from "./coupon-picker";
import PaymentsPicker from "./payment-method-picker";
import {ErrorBoundary} from "react-error-boundary";
const MyApp = () => {
    //const navigate = useNavigate();
    const [currentPath, setCurrentPath] = useState();
    return (
    <RecoilRoot>
      <ErrorBoundary fallback={<div className={`p-4`}>Đã có lỗi xảy ra! Xin vui lòng tải lại</div>}>
      <ConfigProvider
        cssVariables={{
          "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
          "--zmp-primary-color-rgb": hexToRgb(
            getConfig((c) => c.template.primaryColor)
          ),
        }}
      >
        <App >


            {/*<Suspense
            fallback={
              <div className=" w-screen h-screen flex justify-center items-center">
                <Spinner />
              </div>
            }
          >*/}
            <SnackbarProvider>
              <ZMPRouter>
                <Header/>
                  <AnimationRoutes>
                  <Route path="/" element={<HomeMain/>}/>
                  <Route
                        path="/cart"
                        element={<UserCart/>}
                  />
                    <Route
                        path="/order-summaries"
                        element={<OrderSummaries/>}
                    />
                      <Route
                          path="/shipping-methods"
                          element={<ShippingMethods/>}
                      />
                      <Route
                          path="/payment-methods"
                          element={<PaymentMethods/>}
                      /><Route
                      path="/waiting-payment"
                      element={<WaitingPayment/>}/>
                      <Route
                      path="/my-orders"
                      element={<Orders/>}/>
                      <Route
                      path="/my-addresses/:from"
                      element={<UserAddresses/>}/>
                      <Route
                      path="/my-profile"
                      element={<UserProfile/>}/>

                      <Route
                          path="/news-page"
                          element={<NewsPage/>}/>
                      <Route
                          path="/categories"
                          element={<CategoriesPage/>}/>
                      <Route
                      path="/category-detail/:catId"
                      element={<CategoriesPage/>}/>
                      <Route
                          path="/edit-address/:from"
                          element={<UserEditAddress/>}/>
                      <Route
                          path="/search"
                          element={<SearchPage/>}
                      />
                      <Route
                          path="/select-coupon"
                          element={<CouponsPage/>}
                      />
                      <Route
                          path="/user-info"
                          element={<UserInfo/>}
                      />

                      <Route
                          path="/detail-new/:newId"
                          element={<NewDetail/>}/>
                </AnimationRoutes>
                <CheckoutNav/>
                <ProductsPicker/>
                <ProductPicker />

                <StoresPicker />
                <CouponsPicker />
                <PaymentsPicker />

                <BottomNav/>
              </ZMPRouter>
            </SnackbarProvider>
              {/*}</Suspense>*/}
        </App>
      </ConfigProvider>
      </ErrorBoundary>
    </RecoilRoot>
  );
};
export default MyApp;
