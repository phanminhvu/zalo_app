import { useRecoilState } from 'recoil'
import { useCallback } from 'react'
import { CartProduct } from '../models'
import { cartState } from '../states/cart'
import { saveCartToCache } from '../services/storage'

const useAddProductToCart = () => {
	const [cart, setCart] = useRecoilState(cartState)
	return useCallback(
		({
			productCart,
			isEdit,
			childProductCarts,
		}: {
			productCart: CartProduct
			isEdit: boolean
			childProductCarts: CartProduct[]
		}) => {
			if (isEdit === true) {
				setCart((oldCart) => {
					let cart = { ...oldCart }
					if (cart.cartItems && cart.cartItems?.length > 0) {
						/*bo het san pham mua them*/
						if (productCart?.parent == 0) {
							cart.cartItems = cart.cartItems.filter((item) => item.parent !== productCart.product_id)
							const orderIndex = cart.cartItems.findIndex(
								(prod: CartProduct) => prod.product_id === productCart.product_id,
							)
							if (orderIndex >= 0) {
								if (productCart.quantity > 0) {
									cart.cartItems.splice(orderIndex, 1, { ...productCart })
									if (childProductCarts && childProductCarts?.length > 0) {
										const newChildProductCarts = childProductCarts.map((chPC) => {
											return {
												...chPC,
												quantity: productCart.quantity,
											}
										})
										cart.cartItems = [...cart.cartItems, ...newChildProductCarts]
									}
								} else {
									cart.cartItems.splice(orderIndex, 1)
								}
							}
						}
						cart.totalCart = 0
						if (cart.cartItems && cart.cartItems?.length > 0) {
							cart.cartItems.map((cItem, cIndex) => {
								const aPrice =
									cItem?.sale_price && cItem?.sale_price > 0
										? Number(cItem.sale_price) * cItem.quantity
										: Number(cItem.price) * cItem.quantity
								cart.totalCart += aPrice
							})
						}
						/*const parentItems = cart.cartItems.filter(cItem=>cItem.parent === 0);
            if(parentItems && parentItems?.length > 0){
              parentItems.map((cartItem,cIndex) => {
                const aPrice = (cartItem?.sale_price && cartItem?.sale_price > 0 ) ? Number(cartItem.sale_price) * cartItem.quantity : Number(cartItem.price) * cartItem.quantity;
                cart.totalCart += parseFloat(aPrice);
                const childCItems =  cart.cartItems.filter(cItem=>cItem.parent === cartItem.product_id);
                if(childCItems && childCItems?.length > 0){
                  childCItems.map((childItem,cIndex) => {
                    const aPrice = (childItem?.sale_price && childItem?.sale_price > 0 ) ? Number(childItem.sale_price) * childItem.quantity : Number(childItem.price) * childItem.quantity;
                    cart.totalCart += parseFloat(aPrice);
                  });
                }
              });
            }else{
              cart.totalCart = 0;
            }*/
					}

					saveCartToCache(cart)
					return cart
				})
			} else {
				if (productCart && productCart.quantity > 0 && Number(productCart.price) > 0) {
					setCart((oldCart) => {
						let cart = { ...oldCart }
						//chi them moi
						if (cart.cartItems && cart.cartItems?.length > 0) {
							cart.cartItems = [...cart.cartItems, productCart]
						} else {
							cart.cartItems = [productCart]
						}
						/*if(childProductCarts && childProductCarts?.length > 0){
              cart.cartItems = [...cart.cartItems,...childProductCarts]
            }*/
						if (childProductCarts && childProductCarts?.length > 0) {
							const newChildProductCarts = childProductCarts.map((chPC) => {
								return {
									...chPC,
									quantity: productCart.quantity,
								}
							})
							cart.cartItems = [...cart.cartItems, ...newChildProductCarts]
						}
						cart.totalCart = 0
						if (cart.cartItems && cart.cartItems?.length > 0) {
							cart.cartItems.map((cItem, cIndex) => {
								const aPrice =
									cItem?.sale_price && cItem?.sale_price > 0
										? Number(cItem.sale_price) * cItem.quantity
										: Number(cItem.price) * cItem.quantity
								cart.totalCart += aPrice
							})
						}
						/*const parentItems = cart.cartItems.filter(cItem=>cItem.parent === 0);
            if(parentItems && parentItems?.length > 0){
              parentItems.map((cartItem,cIndex) => {
                const aPrice = (cartItem?.sale_price && cartItem?.sale_price > 0 ) ? Number(cartItem.sale_price) * cartItem.quantity : Number(cartItem.price) * cartItem.quantity;
                cart.totalCart += parseFloat(aPrice);
                const childCItems =  cart.cartItems.filter(cItem=>cItem.parent === cartItem.product_id);
                if(childCItems && childCItems?.length > 0){
                  childCItems.map((childItem,cIndex) => {
                    const aPrice = (childItem?.sale_price && childItem?.sale_price > 0 ) ? Number(childItem.sale_price) * childItem.quantity : Number(childItem.price) * childItem.quantity;
                    cart.totalCart += parseFloat(aPrice);
                  });
                }
              });
            }else{
              cart.totalCart = 0;
            }*/

						saveCartToCache(cart)

						return cart
					})
				}
			}
		},
		[cart],
	)
}
export default useAddProductToCart
