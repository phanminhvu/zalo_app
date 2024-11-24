import {useEffect} from "react";
import React from "react";
import { Carousel } from 'flowbite-react';

const ImageCarousel = ({images}) => {
   /* useEffect(() => {
        const init = async () => {
            const {  Carousel,  initTE } = await import("tw-elements");
            initTE({ Carousel});
        };
        init();
    }, []);*/

    return images?.length > 0 ? (<div className={'relative h-96'}><Carousel slideInterval={1000} >
        {images?.map((image,index)=> (<img key={`image`+index}
            src={image?.src}
            alt="..."/>))}
    </Carousel></div>)  : (<></>)
}
export default ImageCarousel;
