import {useEffect, useState} from "react";
import React from "react";
import { Carousel } from 'flowbite-react';
import Glider from 'react-glider';
import CardProductVertical from "../../components/custom-card/product-vertical";
import {noImage} from "../../utils/constants";
const ProductCarouselVertical = ({products}) => {

    return (<Glider
        draggable
        hasArrows={false}
        hasDots={false}
        slidesToShow={2}
        slidesToScroll={1}
        exactWidth
      >
      {products && products.map((product,pIndex) => (
          <CardProductVertical
              key={`pp${pIndex}`}
              product={product}
              canAdd={true}
          />
      ))}
      </Glider>)
}
export default ProductCarouselVertical;
