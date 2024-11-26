import React, { useState } from 'react'
import Tab from './Tab'
const Tabs = ({ children }) => {
	const findActiveTab = (a) => {
		return a.reduce((accumulator, currentValue, i) => {
			if (currentValue.props.active) {
				return i
			}

			return accumulator
		}, 0)
	}

	const tabValidator = (tab) => {
		return tab.type.displayName === 'Tab' ? true : false
	}

	const [activeTab, setActiveTab] = useState(findActiveTab(children))

	return (
		<div className={'flex gap-2 '}>
			<div className=' justify-center bg-slate-100 h-screen  p-2 w-1/4'>
				{children.map((item, i) => {
					return (
						<Tab key={`tab-${i}`} currentTab={i} activeTab={activeTab} setActiveTab={setActiveTab}>
							{item.props.children}
						</Tab>
					)
				})}
			</div>
			<div className='p-4 bg-white flex-1'>
				{children.map((item, i) => {
					return (
						<div key={`tabcontent-${i}`} className={` ${i === activeTab ? 'visible' : 'hidden'}`}>
							{item.props.component}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Tabs
