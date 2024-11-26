import { useEffect, useState } from 'react'
import React from 'react'
import { Carousel } from 'flowbite-react'
import Glider from 'react-glider'
import CardCouponHorizontal from '../../components/custom-card/card-coupon'
import { noImage } from '../../utils/constants'
import { useRecoilState } from 'recoil'
import { Coupon } from '../../models'
import { selectedCouponState } from '../../states/cart'
const CouponCarousel = ({ coupons }) => {
	const [selectedCoupon, setSelectedCoupon] = useRecoilState<Coupon>(selectedCouponState)
	return (
		<Glider draggable hasArrows={false} hasDots={false} slidesToShow={2} slidesToScroll={1} exactWidth>
			{coupons &&
				coupons.map((coupon, cIndex) => (
					<CardCouponHorizontal
						key={`cc_${cIndex}`}
						onClick={() => {
							setSelectedCoupon(coupon)
						}}
						active={selectedCoupon.id === coupon.id}
						coupon={coupon}
					/>
				))}
		</Glider>
	)
}
export default CouponCarousel
