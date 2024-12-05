// import {REST_API_URL, WOO_API_URL} from "../utils/constants";
import { loadUserFromCache } from './storage'

const ULR_API = 'https://quequan.vn:8081/customer'

export const getOrders = async (status) => {
	// https://quequan.vn:8081/customer/listorder?userid=6465140566074194111
	try {
		const userInfo = await loadUserFromCache()
		const userId = userInfo?.id ?? ''
		if (!userId) {
			throw new Error('Thất bại!')
		}

		const response = await fetch(`${ULR_API}/listorder?userid=${userId}&status=${status}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// console.log(response)

		if (!response.ok) {
			throw new Error('Thất bại!')
		}
		const data = await response.json()
		return data
	} catch (e) {
		console.error(e)
	}
}
