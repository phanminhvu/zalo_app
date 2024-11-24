import React, {useEffect, useRef, useState} from 'react';
import {renderHTML} from "../../utils/functions";
import { Page, Button, Box, Text, Icon } from "zmp-ui";
const ProductDescription = ({ text, height=220}) => {
    const ref = useRef(null)
    const [isExpand, setIsExpand] = useState(false);
    const [heightContent, setHeightContent] = useState(0);
    useEffect(() => {
        if (ref && ref.current) {
            setHeightContent(ref?.current?.clientHeight);
        }
    }, [ref.current])
    return (
            <div className={`relative overflow-hidden` } style={{height: isExpand === false ? `${height}px` : `auto`}}>
                <div ref={ref}>
                    {renderHTML(text)}
                </div>

                {(heightContent > height) &&
                <div className={`${isExpand === false ? `absolute top-[190px]` : `relative bottom-0 left-0`} text-center  w-full`}>
                    <Button   prefixIcon={<Icon icon={isExpand === false ? `zi-chevron-down` : `zi-chevron-up`}></Icon>} onClick={() => {
                    setIsExpand(!isExpand)
                    if(isExpand && typeof window !== 'undefined' && typeof  ref?.current !== 'undefined'){
                       // window.scrollTo(0, ref?.current?.offsetTop)
                    }
                }} className={`relative text-pink-400 width-[120]`}  variant="tertiary" size="large" >
                    {isExpand === false ? `Xem thêm` : `Thu gọn`}
                </Button></div>
                }
            </div>
    )
}
export default ProductDescription
