import React, { useState, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { Box, Button, Icon } from 'zmp-ui'
import { Coupon } from '../../models'
import { convertPrice } from '../../utils'
import moment from 'moment'
type CardCouponHorizontalProps = {
	coupon: Coupon
	onClick: any
	active: boolean
}
const CardCouponHorizontal = ({ coupon, onClick = () => {}, active }: CardCouponHorizontalProps) => {
	return coupon ? (
		<div
			className={`w-fit bg-white flex  items-start border ${
				active === true ? 'border-primary' : 'border-slate-300'
			}  rounded-lg overflow-hidden mr-2 px-2 py-1`}
			role='button'
			onClick={onClick}>
			<div className={'flex-1'}>
				<p className='line-clamp-2 text-sm font-semibold align-top'>{coupon.description}</p>
				<p className=' pt-2 text-xs text-slate-400'>
					{`HSD: ${coupon.date_expires ? moment(coupon.date_expires).format('DD/MM/YYYY') : 'Không giới hạn'}`}
				</p>
			</div>
		</div>
	) : (
		<></>
	)
}
export default CardCouponHorizontal
