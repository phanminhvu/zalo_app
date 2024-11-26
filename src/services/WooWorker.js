/**
 * Created by InspireUI on 22/02/2017.
 *
 * @format
 */

import WooCommerceAPI from './WooCommerceAPI'
import { ConsumerKey, ConsumerSecret, LANG, WOO_API_URL, WpConstants } from '../utils/constants'
const lang = LANG
const API = new WooCommerceAPI({
	url: WOO_API_URL,
	consumerKey: ConsumerKey,
	consumerSecret: ConsumerSecret,
	wp_api: true,
	version: 'wc/v2',
	queryStringAuth: true,
})

const WooWorker = {
	getCategories: async () => {
		try {
			const response = await API.get('products/categories', {
				hide_empty: true,
				per_page: 100,
				order: 'desc',
				orderby: 'count',
				lang,
			})
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getCustomerByEmail: async (email) => {
		try {
			const response = await API.get('customers', { email, lang })
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getCustomerById: async (id) => {
		try {
			const response = await API.get(`customers/${id}`)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	productsByCategoryId: async (category, per_page, page, searchString = '') => {
		try {
			const response = await API.get('products', {
				search: searchString,
				category,
				per_page,
				page,
			})
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},

	productsByCategoryTag: async (category, tag, featured, onSale, products, per_page, page) => {
		try {
			// only show product published
			let params = {
				per_page,
				page,
				purchasable: true,
				status: 'publish',
				orderby: 'date',
				order: 'asc',
				lang,
			}
			if (category != '') {
				params = { ...params, category }
			} else if (tag != '') {
				params = { ...params, tag }
			} else if (featured) {
				params = { ...params, featured }
			} else if (onSale) {
				params = { ...params, on_sale: onSale }
			} else if (products && products.length > 0) {
				params = { ...params, include: products }
			}
			const response = await API.get('products', params)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	reviewsByProductId: async (id) => {
		try {
			const response = await API.get(`products/${id}/reviews`)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	createOrder: async (data) => {
		const dataFinal = { ...data, lang }
		try {
			const response = await API.post('orders', dataFinal)
			return response.json()
		} catch (e) {
			// warn(e)
		}
	},
	updateOrder: async (id, data) => {
		try {
			const response = await API.post('orders/' + id, data)
			return response.json()
		} catch (e) {
			// warn(e)
		}
	},
	productsByTagId: async (tagId, per_page, page) => {
		try {
			const response = await API.get('products', {
				tag: tagId,
				per_page,
				page,
				lang,
			})
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	productsByName: async (name, per_page, page, filter = {}) => {
		try {
			const response = await API.get('products', {
				search: name,
				per_page,
				page,
				...filter,
				lang,
			})
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	productSticky: async (per_page, page) => {
		try {
			const response = await API.get('products', {
				tag: WpConstants.tagIdBanner,
				per_page,
				page,
				lang,
			})
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getAllProducts: async (
		per_page,
		page,
		featured = false,
		order = WpConstants.PostList.order,
		orderby = WpConstants.PostList.orderby,
	) => {
		try {
			const data = {
				per_page,
				page,
				featured,
				order,
				orderby,
				lang,
			}
			const response = await API.get('products', data)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getCities: async () => {
		try {
			const data = {
				type: 'city',
			}
			const response = await API.get('loadaddress', data)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getDistricts: async (cityId) => {
		try {
			const data = {
				type: 'district',
				parent_id: cityId,
			}
			const response = await API.get('loadaddress', data)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getWards: async (districtId) => {
		try {
			const data = {
				type: 'ward',
				parent_id: districtId,
			}
			const response = await API.get('loadaddress', data)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	detailProductById: async (id) => {
		try {
			const response = await API.get(`products/${id}`)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	ordersByCustomerId: async (id, per_page, page) => {
		try {
			const data = {
				customer: id,
				per_page,
				page,
				lang,
			}
			const response = await API.get('orders', data)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	createNewOrder: (data, callback, failCallBack) => {
		const dataFinal = { ...data, lang }
		API.post('orders', dataFinal)
			.then((response) => response.json())
			.then((json) => {
				if (json.code === undefined) callback(json)
				else {
					console.log(JSON.stringify(json))
					typeof failCallBack === 'function' && failCallBack()
				}
			})
			.catch()
	},
	createNewAddress: (data, callback, failCallBack) => {
		const dataFinal = { ...data, lang }
		API.post('address', dataFinal)
			.then((response) => response.json())
			.then((json) => {
				if (json.code === undefined && typeof callback === 'function') callback(json)
				else {
					typeof failCallBack === 'function' && failCallBack()
				}
			})
			.catch()
	},
	getPayments: async () => {
		try {
			const response = await API.get('payment_gateways')
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},

	setOrderStatus: (orderId, status, callback) => {
		API.post(`orders/${orderId}`, { status })
			.then((json) => {
				if (json.code === undefined) callback(json)
				else {
					alert(JSON.stringify(json.code))
					// console.log(JSON.stringify(json))
				}
			})
			.catch((error) => {
				console.log(err)
			})
	},
	productVariant: async (product, per_page, page) => {
		try {
			const data = {
				per_page,
				page,
				lang,
			}
			const response = await API.get(`products/${product.id}/variations`, data)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getProductRelated: async (product) => {
		try {
			const data = {
				include: [product],
				lang,
			}
			const response = await API.get('products', data)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getAllCouponCode: async () => {
		try {
			const response = await API.get('coupons')
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getShippingMethod: async () => {
		try {
			const response = await API.get('shipping/zones/1/methods')
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getPaymentMethods: async () => {
		try {
			const response = await API.get('payment_gateways')
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getUserShippingAddress: async () => {
		try {
			const response = await API.get(`address`)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	createOrder: async (data, callback = () => {}) => {
		try {
			const response = await API.post(`orders`, data)
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
	getUserOrders: async (customerId, page, per_page) => {
		try {
			const response = await API.get(`orders`, { customer: customerId, page, per_page })
			return response.json()
		} catch (err) {
			console.log(err)
		}
	},
}

export default WooWorker
