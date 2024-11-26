import React, { useEffect, useState } from 'react'
import Container from '../components/layout/Container'
import { useRecoilValue } from 'recoil'
import { Input, Text, useNavigate } from 'zmp-ui'
import { Category, Product } from '../models'
import { homeCategoriesState, homeProductsState } from '../states/home'
import useSetHeader from '../hooks/useSetHeader'
import { removeVietnameseTones } from '../utils/functions'
import CardProductVertical from '../components/custom-card/product-vertical'
import EmptyBox from '../components/empty'
import { useParams } from 'react-router-dom'

const CategoriesPage = () => {
	const allProducts = useRecoilValue<Product[]>(homeProductsState)
	const categories = useRecoilValue<Category[]>(homeCategoriesState)
	const setHeader = useSetHeader()
	const navigate = useNavigate()
	const [activeCategory, setActiveCategory] = useState<Category>(null)
	const [products, setProducts] = useState<Product>([])
	const [searchString, setSearchString] = useState([])
	const [letSearch, setLetSearch] = useState(true)
	let { catId } = useParams()
	useEffect(() => {
		setHeader({
			customTitle: 'Danh mục',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
		})
		if (!activeCategory) {
			if (Number(catId) > 0) {
				setActiveCategory(categories.find((c) => c.id === Number(catId)))
			} else {
				setActiveCategory(categories[0])
			}
		}
		setProducts(allProducts)
	}, [categories, catId])
	const onSearchChange = (e) => {
		setSearchString(e.target.value.split(' '))
	}
	useEffect(() => {
		let poptions
		let searchPattern
		if (searchString && searchString.length) {
			searchPattern = new RegExp(
				searchString.map((term) => `(?=.*${removeVietnameseTones(term.toLowerCase())})`).join(''),
				'i',
			)
		}
		if (activeCategory) {
			poptions = allProducts.filter((p) => p.category_id === activeCategory.id)
		}
		if (poptions && poptions?.length > 0 && searchPattern) {
			poptions = poptions.filter((pr) => removeVietnameseTones(pr.name).toLowerCase().match(searchPattern))
		}
		setProducts(poptions)
	}, [activeCategory, searchString])

	return (
		<Container className={'bg-white px-4 mb-20'}>
			<div className='w-full border-b border-gray-200 overflow-auto'>
				{categories && (
					<nav className='flex space-x-2 overscroll-x-auto ' aria-label='Tabs' role='tablist'>
						{categories
							.filter((cat) => cat.parent === 0)
							.map((category: Category, cIndex: number) => {
								return (
									<button
										key={`cat_${cIndex}`}
										type='button'
										className={`font-semibold ${
											activeCategory && activeCategory.id === category.id ? 'text-primary  border-b border-primary' : ''
										}  py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500 `}
										data-hs-tab='#tabs-with-underline-1'
										aria-controls='tabs-with-underline-1'
										role='tab'
										onClick={() => {
											setActiveCategory(category)
											/*setProducts(old => {
                            const nProducts = allProducts.filter(p => {
                                return searchString!= '' ? (p.category_id === category.id && p.name.includes(searchString) ) : (p.category_id === category.id)
                            });
                            return nProducts ? nProducts : []
                        })*/
										}}>
										{category.name}
									</button>
								)
							})}
					</nav>
				)}
			</div>
			<div className={'flex rounded-md border border-slate-200 mt-4'}>
				<Input
					label=''
					helperText=''
					placeholder='Tìm kiếm'
					className='border-0 m-0'
					size={'medium'}
					value={searchString}
					onChange={onSearchChange}
				/>
			</div>
			{/*{((products?.length < 1 )) && <EmptyBox title={`Chưa có sản phẩm nào`} content={``}/>}*/}
			{products?.length === 0 && (
				<div className='flex mt-4 w-full justify-center'>
					<Text>Không tìm thấy kết quả. Vui lòng thử lại</Text>
				</div>
			)}
			<section className='w-fit mx-auto grid grid-cols-2 gap-3 mt-5'>
				{products &&
					products.length > 0 &&
					products.map((product) => <CardProductVertical product={product} key={product.id} grid />)}
			</section>
		</Container>
	)
}
export default CategoriesPage
