import { Rating } from 'flowbite-react';
import React from 'react';
import {Text} from "zmp-ui";
import ProductDescription from "./ProductDescription";
const ProductRating = ({item}) => {
    return <div>
        <Text size={'xxSmall'} className={'text-zinc-400'}>
            {item?.name}
        </Text>
        <Rating>
            <Rating.Star  filled={parseInt(item?.rating) > 0 ? true : false}/>
            <Rating.Star  filled={parseInt(item?.rating) > 1 ? true : false}/>
            <Rating.Star  filled={parseInt(item?.rating) > 2 ? true : false}/>
            <Rating.Star  filled={parseInt(item?.rating) > 3 ? true : false}/>
            <Rating.Star  filled={parseInt(item?.rating) > 4 ? true : false}/>
        </Rating>
        <ProductDescription text={item?.review} height={80}></ProductDescription>
    </div>
}
export default ProductRating;
