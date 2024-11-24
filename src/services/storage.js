import api from 'zmp-sdk'

export const loadAddresses = () =>
	new Promise((resolve) => {
		api.getStorage({
			keys: ['addresses'],
			success: ({ addresses }) => {
				if (addresses) {
					if (addresses.filter) {
						resolve(addresses.filter((a) => !!a && !!a.address))
					}
				}
				resolve([])
			},
			fail: (error) => {
				console.log('Failed to get addresses from storage. Details: ', error)
				resolve([])
			},
		})
	})
export const resetAddress = async (addresses) => {
	api.setStorage({
		data: { addresses },
		fail: (error) => console.log('Failed to reset addresses to storage. Details: ', error),
	})
	return addresses
}
export const saveAddress = async (address) => {
	const caddresses = await loadAddresses()
	let addresses = [...caddresses]
	let newId = 0
	if (address?.id > 0) {
		const addressIndex = addresses.findIndex((addr) => addr.id === address?.id)
		if (address?.default === true) {
			addresses = addresses?.map((addr) => ({
				...addr,
				default: false,
			}))
		}

		if (addressIndex >= 0) {
			console.log('replacing ', addressIndex, ' -> ', address?.id)
			addresses.splice(addressIndex, 1, { ...address })
		}
		newId = address?.id
	} else {
		let maxId = 0
		if (addresses && addresses?.length > 0) {
			maxId =
				addresses?.reduce((acc, value) => {
					return (acc = acc > value.id ? acc : value.id)
				}, 0) || 0
			if (address?.default === true) {
				addresses = addresses?.map((addr) => ({
					...addr,
					default: false,
				}))
			}
		}

		addresses.push({
			...address,
			id: maxId + 1,
		})
		newId = maxId + 1
	}

	api.setStorage({
		data: { addresses },
		fail: (error) => console.log('Failed to save new address to storage. Details: ', error),
	})

	return {
		...address,
		id: newId,
	}
}
export const loadUserFromCache = () =>
	new Promise((resolve) => {
		api.getStorage({
			keys: ['user'],
			success: ({ user }) => {
				if (user) {
					resolve(user)
				}
				resolve()
			},
			fail: (error) => {
				console.log('Failed to load user from cache. Details: ', error)
				resolve()
			},
		})
	})

export const saveUserToCache = async (user) => {
	await api.setStorage({
		data: { user },
		fail: (error) => console.log('Failed to save user to cache. Details: ', error),
	})
	return user
}
export const loadCartFromCache = () =>
	new Promise((resolve) => {
		api.getStorage({
			keys: ['cart'],
			success: ({ cart }) => {
				if (cart) {
					resolve(cart)
				}
				resolve()
			},
			fail: (error) => {
				console.log('Failed to load cart from cache. Details: ', error)
				resolve()
			},
		})
	})

export const saveCartToCache = async (cart) => {
	await api.setStorage({
		data: { cart },
		fail: (error) => console.log('Failed to save cart to cache. Details: ', error),
	})
	return cart
}
export const resetCartCache = async () => {
	try {
		const { errorKeys } = await api.removeStorage({
			keys: ['cart'],
		})
	} catch (error) {
		// xử lý khi gọi api thất bại
		console.log(error)
	}
}
export const loadOrderFromCache = () =>
	new Promise((resolve) => {
		api.getStorage({
			keys: ['orders'],
			success: ({ orders }) => {
				if (orders) {
					resolve(orders)
				}
				resolve()
			},
			fail: (error) => {
				console.log('Failed to load order from cache. Details: ', error)
				resolve()
			},
		})
	})

export const saveOrderToCache = async (order) => {
	const corders = await loadOrderFromCache()
	let orders = corders && corders?.length > 0 ? [...corders] : []
	orders.push(order)
	await api.setStorage({
		data: { orders },
		fail: (error) => console.log('Failed to save order to cache. Details: ', error),
	})
	return orders
}
