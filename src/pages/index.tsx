import React, { useEffect, useMemo, useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Input, Page } from "zmp-ui";
import ButtonFixed from "../components/button-fixed/button-fixed";
import ButtonPriceFixed from "../components/button-fixed/button-price-fixed";
import CategoriesStore from "../components/categories-store";
import CardProductHorizontal from "../components/custom-card/card-product-horizontal";
import CardShop from "../components/custom-card/card-shop";

import { filter } from "../constants/referrence";
import { Product } from "../models";
import {
  activeCateState,
  activeFilterState,
  cartState,
  cartTotalPriceState,
  searchProductState,
  storeProductResultState,
  storeState,
} from "../state";
import { useNavigate } from "react-router-dom";
import useSetHeader from "../hooks/useSetHeader";
import { changeStatusBarColor } from "../services";
import { getConfig } from "../components/config-provider";

const HomePage: React.FunctionComponent = () => {
  const store = useRecoilValue(storeState);
  const cart = useRecoilValue(cartState);
  const totalPrice = useRecoilValue(cartTotalPriceState);

  const [activeCate, setActiveCate] = useRecoilState<number>(activeCateState);
  const [activeFilter, setActiveFilter] =
    useRecoilState<string>(activeFilterState);
  const storeProductResult = useRecoilValue<Product[]>(storeProductResultState);
  const setSearchProduct = useSetRecoilState(searchProductState);
  const navigate = useNavigate();
  const setHeader = useSetHeader();

  const handleInputSearch = useCallback((text: string) => {
    setSearchProduct(text);
  }, []);

  const searchBar = useMemo(
    () => (
      <Input.Search
        placeholder="Tìm kiếm sản phẩm"
        onSearch={handleInputSearch}
        className="cus-input-search"
      />
    ),
    []
  );

  useEffect(() => {
    setHeader({
      customTitle: getConfig((c) => c.template.searchBar) ? searchBar : "",
      hasLeftIcon: false,
      type: "secondary",
    });
    changeStatusBarColor("secondary");
  }, []);

  return (
    <Page>
    </Page>
  );
};

export default HomePage;
