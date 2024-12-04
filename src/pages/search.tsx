import React, { useEffect, useState } from 'react'
import { Icon, List, Text } from 'zmp-ui'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import CardProductVertical from '../components/custom-card/product-vertical'
import { Product, ProductInfoPicked } from '../models'
import useSetHeader from '../hooks/useSetHeader'
import { useNavigate } from 'react-router-dom'
import EmptyBox from '../components/empty'
import Container from '../components/layout/Container'
import { homeProductsState } from '../states/home'
import { removeVietnameseTones } from '../utils/functions'
import { noImage } from '../utils/constants'
import { convertPrice } from '../utils'
import { openProductPickerState, productInfoPickedState } from '../state'
import { cartState } from '../states/cart'
const { Item } = List
const SearchPage: React.FunctionComponent = () => {
	const navigate = useNavigate()
	const setHeader = useSetHeader()
	const allProducts = useRecoilValue<Product[]>(homeProductsState)
	const [searchString, setSearchString] = useState([])
	const [products, setProducts] = useState<Product[]>([])
	const [showLoadMore, setShowLoadMore] = useState(false)
	const [letSearch, setLetSearch] = useState(false)
	const searchProduct = () => {
		if (searchString) {
		}
	}
	const setProductInfoPicked = useSetRecoilState(productInfoPickedState)
	const setOpenSheet = useSetRecoilState(openProductPickerState)
	const cart = useRecoilValue(cartState)

	useEffect(() => {
		setHeader({
			customTitle: 'Tìm kiếm',
			hasLeftIcon: true,
			type: 'secondary',
			showAvatar: false,
			showSearch: true,
			onSearchChange: (e) => {
				setSearchString(e.target.value.split(' '))
				/*setTimeout(function() {
                    setProducts(searchString ? allProducts.filter(p => p.name.toLowerCase().includes(searchString.toLowerCase())) : allProducts)

                }, 1500);*/
			},
			onSearchButtonClick: () => {},
		})
		setProducts(allProducts)
	}, [])
	useEffect(() => {
		let poptions
		if (searchString.length) {
			const searchPattern = new RegExp(
				searchString.map((term: string) => `(?=.*${removeVietnameseTones(term.toLowerCase())})`).join(''),
				'i',
			)
			poptions = allProducts.filter((pr) => removeVietnameseTones(pr.name).toLowerCase().match(searchPattern))
			setProducts(poptions)
		} else {
			setProducts(allProducts)
		}
	}, [searchString])

	return (
		<Container className={'bg-white px-4 mt-8'}>
			<div className={`mb-2 pt-7 fixed w-full bg-white z-30`}>
				<Text bold size={'xLarge'}>{`Kết quả (${products.length})`}</Text>
			</div>
			<List divider={false} noSpacing className={'mt-20 mb-20'}>
				{products && products.length > 0
					? products.map((product, index) => (
							<Item
								className={`${!product.status ? 'opacity-50 pointer-events-none' : ''}`}
								title={
									<Text style={{ width: `calc(50vw)`, whiteSpace: 'wrap' }} className={' relative break-words'}>
										{product.name}
									</Text>
								}
								prefix={
									<img
										src={product.image ?? noImage}
										alt={product.name}
										style={{ width: '95px', maxWidth: '95px', height: '95px' }}
										className='aspect-auto relative rounded-lg'
									/>
								}
								subTitle={
									(parseFloat(product.sale_price) > 0 || parseFloat(product.price) > 0) && (
										<div className='flex items-center'>
											{product.on_sale == 1 && product.sale_price > 0 && (
												<del className='mr-2'>
													<p className='text-xs text-gray-600 cursor-auto font-lato '>
														{convertPrice(product.price || 0)}đ
													</p>
												</del>
											)}
											<p className='text-xs text-[#088c4c] cursor-auto font-lato font-[570 ] '>
												{convertPrice(
													product.on_sale == 1 && product.sale_price > 0 ? product.sale_price : product.price,
												)}
												đ
											</p>
										</div>
									)
								}
								onClick={() => {
									//navigate(`/detail-product/${product.id}`);
									setProductInfoPicked((info) => {
										return {
											...info,
											product,
											isBuyNow: false,
											currentItem: cart?.cartItems?.some((cItem) => cItem.product_id === product.id)
												? cart?.cartItems?.find((cItem) => cItem.product_id === product.id)
												: null,
										} as ProductInfoPicked
									})
									setOpenSheet(true)
								}}
								// children= {product.description}
							/>
					  ))
					: []}
			</List>

			{/*<section className="w-fit mx-auto grid grid-cols-2 gap-3 mt-10 mb-5">*/}
			{/*    {(products && products.length > 0) && products.map((product) => (*/}
			{/*        <CardProductVertical product={product} key={product.id}/>*/}
			{/*    ))}*/}
			{/*</section>*/}

			{products.length === 0 && (
				<div className='flex w-full justify-center'>
					<Text>Không tìm thấy kết quả. Vui lòng thử lại</Text>
				</div>
			)}
		</Container>
	)
}
export default SearchPage
