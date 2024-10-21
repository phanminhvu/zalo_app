import {useEffect} from "react";
import React from "react";
import { Carousel } from 'flowbite-react';
import Glider from 'react-glider';
import CardProductHorizontal from "../custom-card/card-product-horizontal";
import {noImage} from "../../utils/constants";
const ProductCarousel = ({products}) => {
    return (<Glider
        draggable
        hasArrows={false}
        hasDots={false}
        slidesToShow={2}
        slidesToScroll={1}
      >
      {products && products.map((product) => (
          <div className=" mr-1 ml-1  w-full" key={product.id}>
            <CardProductHorizontal
                product={product}
                imageW={3}
                canAdd={false}
                height={16}
                padding={2}
            />
          </div>
      ))}
      </Glider>)
}
export default ProductCarousel;
