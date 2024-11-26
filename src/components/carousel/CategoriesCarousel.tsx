import { useEffect } from 'react'
import React from 'react'
import { Carousel } from 'flowbite-react'
import Glider from 'react-glider'
import IconMenu from '../IconMenu'
import { Category, IconMenuProps } from '../../models'
import { useNavigate } from 'react-router-dom'
const CategoriesCarousel: FC<Category[]> = ({ categories }) => {
	const navigate = useNavigate()
	//cat.image.src
	return (
		<Glider draggable hasArrows={false} hasDots={false} slidesToShow={4} slidesToScroll={1}>
			{categories &&
				categories.map((cat: Category, index) => (
					<div key={index} style={{ minWidth: 'auto' }} className={'p-1'}>
						<IconMenu
							image={cat?.image}
							label={cat.name}
							textSize={`text-xs`}
							imageSize={50}
							onClick={() => {
								navigate(`/category-detail/${cat.id}`)
							}}
							outClass={'rounded-lg  overflow-hidden iconavatar flex justify-items-center justify-center items-center'}
						/>
					</div>
				))}
		</Glider>
	)
}
export default CategoriesCarousel
