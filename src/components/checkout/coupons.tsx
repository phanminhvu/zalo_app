import React, { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Button, Input } from 'zmp-ui'
import { Coupon } from '../../models'
import CouponCarousel from '../carousel/CouponCarousel'
import { selectedCouponState } from '../../states/cart'
import { pageGlobalState } from '../../state'

const Coupons = ({ coupons }) => {
	const setErrMsg = useSetRecoilState(pageGlobalState)
	const [couponCode, setCouponCode] = useState('')
	const [selectedCoupon, setSelectedCoupon] = useRecoilState<Coupon>(selectedCouponState)

	useEffect(() => {
		if (selectedCoupon && selectedCoupon.code) {
			setCouponCode(selectedCoupon.code)
		}
	}, [selectedCoupon])

	return coupons ? (
		<div className='py-4'>
			{/*(selectedCoupon && selectedCoupon.id > 0) && <div className={'mb-4'}>
                <Text size={'xSmall'} bold className={`text-sky-500 underline`}>{selectedCoupon.description}</Text>
            </div>*/}

			<div className={'flex rounded-md border border-slate-200 p-2 bg-slate-50'}>
				<Input
					label=''
					helperText=''
					placeholder='Nhập mã giảm giá'
					className='border-0 m-0 bg-slate-50'
					size={'medium'}
					onChange={(e) => {
						setCouponCode(e.target.value)
					}}
					value={couponCode}
				/>
				<Button
					size={'large'}
					className='border-0 m-0 rounded'
					onClick={() => {
						const findCoupon = coupons.find((c) => c.code === couponCode)
						if (findCoupon && findCoupon.id > 0) {
							setSelectedCoupon(findCoupon)
						} else {
							setErrMsg((oldErr) => {
								return {
									...oldErr,
									errMsg: 'Mã giảm giá chưa đúng, xin vui lòng thử lại!',
								}
							})
						}
					}}>
					Áp dụng
				</Button>
			</div>
			<div className='mt-4'>
				<CouponCarousel coupons={coupons} />
			</div>
		</div>
	) : (
		<></>
	)
}
export default Coupons
