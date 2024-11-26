import { atom } from 'recoil'

export const selectedAttributeState = atom({
	key: 'selectedAttribute',
	default: [],
})
export const selectedColorState = atom({
	key: 'selectedColor',
	default: 0,
})
export const selectVariationState = atom({
	key: 'selectVariation',
	default: null,
})
export const productVariationsState = atom({
	key: 'productVariations',
	default: null,
})
export const detailProductState = atom({
	key: 'detailProduct',
	default: null,
})
