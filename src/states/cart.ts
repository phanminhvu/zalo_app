import { atom, selector } from 'recoil'
import {
	Address,
	CartData,
	Coupon,
	Order,
	PaymentMethod,
	ShippingDate,
	ShippingMethod,
} from '../models'
/**
 * {
  cartItems: [],
  total: 0,
  totalPrice: 0,
  myOrders: [],
  isFetching: false,
};
 */
import paymentMethods from '../mock/payment_methods.json'

export const initialCartPickedState = {
	stores: [],
	totalCart: 0,
	totalCheckout: 0,
	isFetching: false,
}
export const addressSearchItemState = atom<string>({
	key: 'addressSearchItem',
	default: '',
})
export const addressAutoState = atom<boolean>({
	key: 'addressAuto',
	default: false,
})
export const cartState = atom<CartData>({
	key: 'userCart',
	default: initialCartPickedState,
})
export const shippingDateState = atom<ShippingDate>({
	key: 'shippingDate',
	default: {},
})
export const shippingAddressState = atom<Address>({
	key: 'shippingAddress',
	default: {},
})
export const shippingMethodsState = atom<ShippingMethod[]>({
	key: 'shippingMethods',
	default: [],
})
export const selectedShippingMethodState = atom<ShippingMethod>({
	key: 'selectedShippingMethod',
	default: {
		id: 0,
		instance_id: 0,
		title: '',
		order: 0,
		enabled: false,
		method_id: 0,
		method_title: '',
		method_description: '',
		settings: null,
	},
})

export const paymentMethodsState = selector<PaymentMethod[]>({
	key: 'paymentMethods',
	get: async ({ get }) => {
		return paymentMethods
	},
})
export const selectedPaymentMethodState = atom<PaymentMethod>({
	key: 'selectedPaymentMethod',
	default: {
		id: 1,
		title: 'Thanh toán khi nhận hàng',
		order: 0,
		notes: 'Thanh toán khi nhận hàng',
		enabled: true,
		code: 'COD',
	},
})
export const userOrdersState = atom<Order[]>({
	key: 'userOrders',
	default: [],
})
export const selectedCouponState = atom<Coupon>({
	key: 'selectedCoupon',
	default: {
		id: 0,
		code: '',
		amount: '',
		status: '',
	},
})
