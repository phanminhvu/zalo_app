import React, { useEffect, useState } from 'react'
import Container from '../components/layout/Container'
import { useRecoilValue } from 'recoil'
import { useNavigate } from 'zmp-ui'
import { NewItem } from '../models'
import useSetHeader from '../hooks/useSetHeader'
import CardNewsVertical from '../components/custom-card/news-vertical'
import EmptyBox from '../components/empty'
import { newssState } from '../states/news'

const NewsPage: React.FunctionComponent = () => {
	const setHeader = useSetHeader()
	const navigate = useNavigate()
	const [activeNewItem, setActiveNewItem] = useState(0)
	const news = useRecoilValue<NewItem[]>(newssState)
	useEffect(() => {
		setHeader({
			customTitle: 'Tin tức',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
		})
	}, [])
	return (
		<Container className={'bg-white px-4 '}>
			<div className="w-full border-b border-gray-200 overflow-auto">
				{news && news?.length > 0 && (
					<nav className="flex space-x-2 overscroll-x-auto " aria-label="Tabs" role="tablist">
						<button
							key={`cat_0`}
							type="button"
							className={`font-semibold  py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap  ${
								activeNewItem === 0 ? 'text-primary  border-b border-primary' : ' '
							}`}
							data-hs-tab="#tabs-with-underline-1"
							aria-controls="tabs-with-underline-1"
							role="tab"
							onClick={() => {
								setActiveNewItem(0)
							}}>{`Tất cả`}</button>
						{news.map((newItem: NewItem, cIndex: number) => {
							return (
								<button
									key={`cat_${cIndex + 1}`}
									type="button"
									className={`font-semibold ${
										activeNewItem && activeNewItem === newItem.id
											? 'text-primary  border-b border-primary'
											: ''
									}  py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap`}
									data-hs-tab="#tabs-with-underline-1"
									aria-controls="tabs-with-underline-1"
									role="tab"
									onClick={() => {
										setActiveNewItem(newItem.id)
									}}>
									{newItem?.title}
								</button>
							)
						})}
					</nav>
				)}
			</div>
			{news?.length < 1 && <EmptyBox title={`Chưa có bài viết nào`} content={``} />}
			{news && news?.length > 0 && (
				<section className="w-fit mt-10 mb-5 pb-8 overflow-y-scroll">
					{activeNewItem == 0 &&
						news &&
						news.length > 0 &&
						news.map((newItem) => <CardNewsVertical newItem={newItem} key={newItem.id} />)}
					{activeNewItem > 0 && news && news.length > 0 && (
						<CardNewsVertical newItem={news.find((nItem) => nItem.id === activeNewItem)} />
					)}
				</section>
			)}
		</Container>
	)
}
export default NewsPage
