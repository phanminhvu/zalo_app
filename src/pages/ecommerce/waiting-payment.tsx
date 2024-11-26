import React, { useEffect } from 'react'
import { Box, Text, useNavigate } from 'zmp-ui'
import Container from '../../components/layout/Container'
import { HiOutlineHome, HiOutlineShoppingBag } from 'react-icons/hi'
import { Button } from 'flowbite-react'
import { useRecoilValue } from 'recoil'
import { Product } from '../../models'
import { homeProductsState } from '../../states/home'
import CardProductVertical from '../../components/custom-card/product-vertical'
import useSetHeader from '../../hooks/useSetHeader'

const WaitingPayment = () => {
	const setHeader = useSetHeader()
	const navigate = useNavigate()
	const products = useRecoilValue<Product[]>(homeProductsState)
	useEffect(() => {
		setHeader({
			customTitle: '',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
		})
	}, [])
	return (
		<Container>
			<Box mt={1} className={'bg-primary p-4'}>
				<Text size={'large'} className={'text-center text-white font-bold'}>{`Đang chờ thanh toán`}</Text>
				<Text
					size={'xSmall'}
					className={'text-center text-white'}>{`Đơn hàng của bạn đã được tạo và đang chờ Shop xác nhận.`}</Text>
				<Button.Group className={`flex w-full  bottom-0 mt-4`}>
					<Button
						className={`flex-1 border-l-0 border-b-0 rounded-none bg-pink-900`}
						onClick={() => {
							navigate('/')
						}}>
						<HiOutlineHome className='mr-2 h-5 w-5' />
						<p>Trang chủ</p>
					</Button>
					<Button
						className={`flex-1 border-l-0 border-r-0 border-b-0 rounded-none`}
						onClick={() => {
							navigate('/my-orders')
						}}>
						<HiOutlineShoppingBag className='mr-2 h-5 w-5' />
						<p>Đơn mua</p>
					</Button>
				</Button.Group>
			</Box>
			<section className='w-fit mx-auto grid grid-cols-2 gap-3 mt-10 mb-5'>
				{products && products.map((product) => <CardProductVertical product={product} key={product.id} />)}
			</section>
		</Container>
	)
}
export default WaitingPayment
