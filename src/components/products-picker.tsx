import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil'
import { pageGlobalState, openProductsPickerState } from '../state'
import React, { useRef } from 'react'
import { Product } from '../models'
import { homeProductsState } from '../states/home'
import { Box, Text, Sheet } from 'zmp-ui'
import CardProductVertical from './custom-card/product-vertical'

const ProductsPicker = () => {
	const setErrMsg = useSetRecoilState(pageGlobalState)
	const [openSheet, setOpenSheet] = useRecoilState<boolean>(openProductsPickerState)
	const products = useRecoilValue<Product[]>(homeProductsState)

	const sheet = useRef<any>(null)
	return (
		<>
			{products && (
				<Sheet
					mask
					visible={openSheet}
					swipeToClose
					maskClosable
					onClose={() => setOpenSheet(false)}
					afterClose={() => {}}
					ref={sheet}
					autoHeight
					title="">
					{products && (
						<Box
							m={0}
							px={4}
							py={4}
							className="bg-white leading-none  items-top justify-start mt-4"
							style={{ overflow: 'scroll' }}>
							<section className="w-fit mx-auto grid grid-cols-2 gap-3 mb-5">
								{products &&
									products.map((product) => (
										<CardProductVertical product={product} key={product.id} grid />
									))}
							</section>
						</Box>
					)}
				</Sheet>
			)}
		</>
	)
}
export default ProductsPicker
