import React, {useEffect, useMemo, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import DokanWorker from "../services/DokanWorker";
import {Product, StoreLite} from "../models";
import CardShop from "../components/custom-card/card-shop";
import {Box} from "zmp-ui";
import CardProductVertical from "../components/custom-card/product-vertical";
import Container from "../components/layout/Container";
import InfiniteScroll from "react-infinite-scroll-component";
const StorePage = () => {
    let { storeId } = useParams();
    const [store, setStore] = useState<StoreLite>();
    const [products, setProducts] = useState<Product[]>();
    const [page, setPage] = useState<number>(1);
    const [hasNext, setHasNext] = useState(true);
    const allowInfinite = useRef(true);
    const [showPreloader, setShowPreloader] = useState(true);
    useEffect(() => {
        if (storeId) {
            DokanWorker.getStoreDetail(storeId).then((res) => {
                setStore(res);
            });

        }
    }, [storeId]);
    useEffect(() => {
        DokanWorker.getStoreProducts(storeId, 4,page).then((res) => {
            if(res && res.length > 0){
                setProducts(oldProducts => {
                    return oldProducts ? [...oldProducts, ...res] : res;
                });
            }

            setHasNext(res && res.length > 0)
        });
    }, [storeId,page])
    return store ? (
        <Container>
            <div
                className=" relative bg-white w-full"
                style={{ paddingBottom: "80px" }}
            >
                <Box m={0} p={4} className="border-b">
                    <CardShop storeInfo={store} />
                </Box>
                <InfiniteScroll
                    className="w-fit mx-auto grid grid-cols-2 gap-3 mt-10 mb-5"
                    dataLength={products ? products.length : 0}
                    next={()=>{console.log("page are",page);setPage(oldPage => oldPage+1)}}
                    hasMore={hasNext}
                    loader={<h4>Loading...</h4>}
                >{products && products.map((product,pIndex) => (
                    <CardProductVertical product={product} key={product.id+"-"+pIndex+"-page"}/>
                ))}</InfiniteScroll>

            </div>
        </Container>
    ) : <Container></Container>
}
export default StorePage;
