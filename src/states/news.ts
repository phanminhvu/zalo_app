import newss from '../mock/news.json'
import { selector } from 'recoil'
import { NewItem } from '../models'

export const newssState = selector<NewItem[]>({
	key: 'newss',
	get: ({ get }) => {
		return newss
	},
})
