import request from './ApiClient'
import { pageGlobalState } from '../state'

export const login = async (data, callback) => {
	try {
		const response = await request.post(
			`wc/v2/zalotoken`,
			{
				data,
			},
			'POST',
			false,
			null,
			false,
		)
		callback(response)
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}
export const getCities = async () => {
	try {
		const response = await request.get(`ctygram/ghn-aff/address`, null, null, false)
		return response
	} catch (error) {
		console.log('Error getCities: ', error)
		return false
	}
}
export const getDistricts = async (cityId) => {
	try {
		const response = await request.get(`ctygram/ghn-aff/address/${cityId}`, null, null, false)
		return response
	} catch (error) {
		console.log('Error getDistricts: ', error)
		return false
	}
}
export const getWards = async (cityId, districtId) => {
	try {
		const response = await request.get(`ctygram/ghn-aff/address/${cityId}/${districtId}`, null, null, false)
		return response
	} catch (error) {
		console.log('Error getDistricts: ', error)
		return false
	}
}
export const getShippingAddress = async () => {
	try {
		const response = await request.get(`wc/v2/address`, null, null, true)
		return response
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}
export const postAddress = async (data, callback) => {
	try {
		const response = await request.post(`wc/v2/address`, data, 'POST', false, null, true)
		callback(response)
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}
export const getAffDashboardUrl = async () => {
	try {
		const response = await request.get(`wc/v2/aff-dashboard-url`, null, null, true)
		return response
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}

export const postAffSetting = async (data, callback) => {
	try {
		const response = await request.post(`wc/v2/aff-settings`, data, 'POST', false, null, true)
		callback(response)
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}
export const getAffSettings = async () => {
	try {
		const response = await request.get(`wc/v2/aff-get-settings`, null, null, true)
		return response
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}

export const getAffDashboardStats = async () => {
	try {
		const response = await request.get(`wc/v2/aff-dashboard-stats`, null, null, true)
		return response
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}
export const getAffDashboardPayouts = async () => {
	try {
		const response = await request.get(`wc/v2/aff-dashboard-payouts`, null, null, true)
		return response
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}

export const getAffDashboardReferrals = async () => {
	try {
		const response = await request.get(`wc/v2/aff-dashboard-referrals`, null, null, true)
		return response
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}
export const getUserInfos = async () => {
	try {
		const response = await request.get(`wc/v2/get-user-infos`, null, null, true)
		return response
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}

export const getAffDashboardVisits = async () => {
	try {
		const response = await request.get(`wc/v2/aff-dashboard-visits`, null, null, true)
		return response
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}
export const updateOrderDiscount = async (data) => {
	try {
		const response = await request.post(`wc/v2/update-order-discount`, data, 'POST', '', null, true)
		return response
	} catch (error) {
		console.log('Error logging in. Details: ', error)
		return false
	}
}
