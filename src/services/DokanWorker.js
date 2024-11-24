import WooCommerceAPI from './WooCommerceAPI'
import { ConsumerKey, ConsumerSecret, LANG, WOO_API_URL, WpConstants } from '../utils/constants'
const lang = LANG
const API = new WooCommerceAPI({
	url: WOO_API_URL,
	consumerKey: ConsumerKey,
	consumerSecret: ConsumerSecret,
	wp_api: true,
	version: 'dokan/v1',
	queryStringAuth: true,
})
const DokanWorker = {
	getStoreProducts: async (id, per_page, page) => {
		try {
			const data = {
				per_page,
				page,
				order: WpConstants.PostList.order,
				orderby: WpConstants.PostList.orderby,
			}
			const response = await API.get(`stores/${id}/products`, data)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getStoreDetail: async (id) => {
		try {
			const response = await API.get(`stores/${id}`)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
}
export default DokanWorker
