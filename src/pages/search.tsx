import React, {useEffect, useState} from "react";
import {Text} from "zmp-ui";
import {useRecoilValue} from "recoil";
import CardProductVertical from "../components/custom-card/product-vertical";
import {Product} from "../models";
import useSetHeader from "../hooks/useSetHeader";
import {useNavigate} from "react-router-dom";
import EmptyBox from "../components/empty";
import Container from "../components/layout/Container";
import {homeProductsState} from "../states/home";
import {removeVietnameseTones} from "../utils/functions";

const SearchPage: React.FunctionComponent = () =>{
    const navigate = useNavigate();
    const setHeader = useSetHeader();
    const allProducts = useRecoilValue<Product[]>(homeProductsState);
    const [searchString,setSearchString] = useState([]);
    const [products,setProducts] = useState([]);
    const [showLoadMore,setShowLoadMore] = useState(false);
    const [letSearch,setLetSearch] = useState(false);
    const searchProduct = () => {
        if(searchString){

        }
    };
    useEffect(() => {
        setHeader({
            customTitle: " ",
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
            const searchPattern = new RegExp(searchString.map(term => `(?=.*${removeVietnameseTones(term.toLowerCase())})`).join(''), 'i');
            poptions = allProducts.filter(pr =>
                removeVietnameseTones(pr.name).toLowerCase().match(searchPattern)
            );
            setProducts(poptions)
        }else{
            setProducts(allProducts)
        }

    }, [searchString]);
    return  (<Container className={"bg-white px-4"}>
        {(products?.length < 1 ) && <EmptyBox title={`Tìm kiếm xem thêm kết quả`} content={`Hãy nhập từ khoá và tìm kiếm sản phẩm ưng ý nhất`}/>}
        <Text bold size={'large'} className={`mb-2 mt-3`}>{`Kết quả`}</Text>
        <section className="w-fit mx-auto grid grid-cols-2 gap-3 mt-10 mb-5">
            {(products && products.length > 0) && products.map((product) => (
                <CardProductVertical product={product} key={product.id}/>
            ))}
        </section>
    </Container>)
}
export default SearchPage;
