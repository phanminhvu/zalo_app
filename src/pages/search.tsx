import React, {useEffect, useState} from "react";
import {Icon, List, Text} from "zmp-ui";
import {useRecoilValue} from "recoil";
import CardProductVertical from "../components/custom-card/product-vertical";
import {Product} from "../models";
import useSetHeader from "../hooks/useSetHeader";
import {useNavigate} from "react-router-dom";
import EmptyBox from "../components/empty";
import Container from "../components/layout/Container";
import {homeProductsState} from "../states/home";
import {removeVietnameseTones} from "../utils/functions";
import {noImage} from "../utils/constants";
import {convertPrice} from "../utils";

const {Item} = List;
const SearchPage: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const setHeader = useSetHeader();
    const allProducts = useRecoilValue<Product[]>(homeProductsState);
    const [searchString, setSearchString] = useState([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const [letSearch, setLetSearch] = useState(false);
    const searchProduct = () => {
        if (searchString) {

        }
    };
    useEffect(() => {
        setHeader({
            customTitle: "Tìm kiếm",
            hasLeftIcon: true,
            type: "secondary",
            showAvatar: false,
            showSearch: true,
            onSearchChange: (e) => {
                setSearchString(e.target.value.split(' '));
                /*setTimeout(function() {
                    setProducts(searchString ? allProducts.filter(p => p.name.toLowerCase().includes(searchString.toLowerCase())) : allProducts)

                }, 1500);*/
            },
            onSearchButtonClick: () => {

            }
        });
        setProducts(allProducts);
    }, []);
    useEffect(() => {
        let poptions;
        if (searchString.length) {
            const searchPattern = new RegExp(searchString.map((term: string) => `(?=.*${removeVietnameseTones(term.toLowerCase())})`).join(''), 'i');
            poptions = allProducts.filter(pr =>
                removeVietnameseTones(pr.name).toLowerCase().match(searchPattern)
            );
            setProducts(poptions)
        } else {
            setProducts(allProducts)
        }

    }, [searchString]);

    return (<Container className={"bg-white px-4 mt-10"}>
            <Text bold size={'large'} className={`mb-2 mt-3 italic`}>{`Kết quả (${products.length})`}</Text>
            <List divider={false} noSpacing
                  style={{
                      marginRight: 4,
                  }}
                  dataSource={
                      (products && products.length > 0) ? products.map((product) => ({
                          title: <Text style={{width: `calc(50vw)`, whiteSpace: "wrap"}}
                                       className={' relative break-words'}>{product.name}</Text>,
                          prefix: <img
                              src={product.image ?? noImage}
                              alt={product.name}
                              style={{width: "95px", maxWidth: "95px", height: "95px"}}
                              className="aspect-auto relative rounded-lg"/>,
                          brackets: (product.on_sale == 1 && product.sale_price > 0) ?
                              <del className="text-xs text-gray-600 font-lato">
                                  {convertPrice(product.price || 0)}đ
                              </del> : false,
                          subTitle: (parseFloat(product.sale_price) > 0 || (parseFloat(product.price) > 0)) && (
                              <div className="flex items-center">
                                  <p className="text-xs text-[#1677ff] cursor-auto font-lato font-[570]">
                                      {convertPrice((product.on_sale == 1 && product.sale_price > 0) ? product.sale_price : product.price)}đ
                                  </p>
                              </div>
                          ),
                          children: product.description
                      })) : []
                  }/>

            {/*<section className="w-fit mx-auto grid grid-cols-2 gap-3 mt-10 mb-5">*/}
            {/*    {(products && products.length > 0) && products.map((product) => (*/}
            {/*        <CardProductVertical product={product} key={product.id}/>*/}
            {/*    ))}*/}
            {/*</section>*/}

            {products.length === 0 && <div className="flex w-full justify-center">
                <Text>Không tìm thấy kết quả. Vui lòng thử lại</Text>
            </div>}

        </Container>
    )
}
export default SearchPage;
