import {useEffect} from "react";
import React from "react";
import { Carousel } from 'flowbite-react';
import Glider from 'react-glider';
import IconMenu from "../IconMenu";
import {IconMenuProps} from "../../models";
const IconMenuCarousel: FC<IconMenuProps[]> = ({icons})  => {
    return (<Glider
        draggable
        hasArrows={false}
        hasDots={false}
        slidesToShow={4}
        slidesToScroll={1}
    >
        {icons && icons.map((ic: IconMenuProps,index) => (
            <div  key={index} style={{minWidth: 'auto'}} className={'p-1'}>
                <IconMenu image={ic.image} label={ic.label} imageSize={ic.imageSize} textSize={ic.textSize} outClass={'rounded-full iconavatar w-14 h-14 flex justify-items-center justify-center items-center'}/>
            </div>
        ))}
    </Glider>)
}
export default IconMenuCarousel;
