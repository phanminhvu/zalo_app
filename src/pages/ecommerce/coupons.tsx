import Container from '../../components/layout/Container'
import React, { useEffect, useState } from 'react'
import { Icon, List, Spinner, useNavigate } from 'zmp-ui'
import useSetHeader from '../../hooks/useSetHeader'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Coupon } from '../../models'
import { couponsState } from '../../states/home'
import { selectedCouponState } from '../../states/cart'
import moment from 'moment'

const CouponsPage = () => {
	const setHeader = useSetHeader()
	const navigate = useNavigate()
	const [loading, setLoading] = useState<boolean>(false)
	const coupons = useRecoilValue<Coupon[]>(couponsState)
	const [selectedCoupon, setSelectedCoupon] = useRecoilState<Coupon>(selectedCouponState)
	useEffect(() => {
		setHeader({
			customTitle: 'Mã giảm giá',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: false,
		})
	}, [])
	const { Item } = List

	return (
		<Container>
			{loading && (
				<div className='text-center pt-10'>
					<Spinner size='xl' />
				</div>
			)}
			{coupons && !loading && (
				<List className='bg-white'>
					{coupons
						.filter((c) => c.status === 1)
						.map((coupon, index) => {
							return (
								<Item
									key={`coupon${index}`}
									className={`mb-0`}
									title={coupon.description}
									subTitle={`HSD: ${
										coupon.date_expires ? moment(coupon.date_expires).format('DD/MM/YYYY') : 'Không giới hạn'
									}`}
									onClick={() => {
										setSelectedCoupon(coupon)
										navigate(-1)
									}}
									suffix={selectedCoupon && selectedCoupon.id === coupon.id ? <Icon icon='zi-check' /> : <></>}
								/>
							)
						})}
				</List>
			)}
		</Container>
	)
}
export default CouponsPage
