import React, { useEffect, useState } from 'react'
import { Page } from 'zmp-ui'
import { Button, Spinner } from 'flowbite-react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { homeCategoriesState } from '../states/home'
import { AuthData, Category } from '../models'
import useSetHeader from '../hooks/useSetHeader'
import { authState } from '../states/auth'
import { useNavigate, useParams } from 'react-router-dom'
import CardProductVertical from '../components/custom-card/product-vertical'

const CategoryDetail: React.FunctionComponent = () => {
	//const products = useRecoilValue<Product[]>(homeProductsState);
	const navigate = useNavigate()
	const setHeader = useSetHeader()
	let { catId } = useParams()
	const categories = useRecoilValue<Category[]>(homeCategoriesState)
	const [products, setProducts] = useState([])
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [showLoadMore, setShowLoadMore] = useState(true)
	const [categoryDetail, setCategoryDetail] = useState<Category>(null)
	useEffect(() => {
		if (catId) {
			setCategoryDetail(categories.find((cat) => Number(cat.id) === Number(catId)))
		}
	})
	useEffect(() => {
		setLoading(true)
	}, [catId, page])
	useEffect(() => {
		setHeader({
			customTitle: categoryDetail ? categoryDetail.name : 'Danh mục',
			hasLeftIcon: true,
			type: 'secondary',
		})
	}, [categoryDetail])
	const [authDt, setAuthDt] = useRecoilState<AuthData>(authState)
	return (
		<Page style={{ paddingBottom: `64px` }}>
			<section className='w-fit mx-auto grid  grid-cols-2 justify-items-center justify-center gap-y-5 gap-x-5 mt-10 mb-5'>
				{products &&
					products.length > 0 &&
					products.map((product) => <CardProductVertical product={product} key={product.id} />)}
			</section>
			{showLoadMore && (
				<div className='flex items-center justify-center text-center w-full px-4 py-4'>
					<Button
						onClick={() => {
							setPage((old) => old + 1)
						}}
						color='gray'>
						{loading && <Spinner size='sm' />}
						<span className='pl-3'>{loading ? 'Đang tải' : 'Nhiều hơn'}</span>
					</Button>
				</div>
			)}
		</Page>
	)
}
export default CategoryDetail
