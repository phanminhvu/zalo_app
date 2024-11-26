import React, { useEffect, useState } from 'react'
import Container from '../../components/layout/Container'
import useSetHeader from '../../hooks/useSetHeader'
import { paymentMethodsState, selectedPaymentMethodState } from '../../states/cart'
import { useRecoilState } from 'recoil'
import { Icon, List, useNavigate } from 'zmp-ui'
import { Spinner } from 'flowbite-react'

const PaymentMethods = () => {
	const [paymentMethods, setPaymentMethods] = useRecoilState(paymentMethodsState)
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useRecoilState(selectedPaymentMethodState)
	const setHeader = useSetHeader()
	const navigate = useNavigate()
	const [loading, setLoading] = useState<boolean>(false)
	useEffect(() => {
		setHeader({
			customTitle: 'Phương thức thanh toán',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
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
			{paymentMethods && !loading && (
				<List className='bg-white'>
					{paymentMethods.map((payment, index) => {
						return payment.enabled ? (
							<Item
								key={`payment${index}`}
								className={`mb-0`}
								title={payment.title}
								onClick={() => {
									setSelectedPaymentMethod(payment)
									navigate('/checkout')
								}}
								suffix={
									selectedPaymentMethod && selectedPaymentMethod.id === payment.id ? <Icon icon='zi-check' /> : <></>
								}
							/>
						) : (
							<></>
						)
					})}
				</List>
			)}
		</Container>
	)
}
export default PaymentMethods
