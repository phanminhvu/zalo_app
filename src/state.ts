import {atom, selector} from "recoil";
import {Address, HeaderType, PageGolobal, Product, ProductInfoPicked, Store, StoreOrder,} from "./models";
import {getRandomInt} from "./utils";
import {filter} from "./constants/referrence";
/*
export const storeState = selector<Store>({
  key: "store",
  get: () => {
    return createDummyStore();
  },
});*/
export const storeState = atom<Store>({
  key:"store",
  default: {
    id: 0,
    logoStore: "",
    bannerStore: "",
    nameStore: "",
    followers: 0,
    address: "",
    type: "personal",
    categories: [],
    listProducts: [],
  }
})
export const productState = selector<Product[]>({
  key: "product",
  get: ({ get }) => {
    const store = get(storeState);
    return store.listProducts;
  },
});

export const cartState = atom<StoreOrder>({
  key: "cart",
  default: {
    status: "pending",
    listOrder: [],
    date: new Date(),
  },
});

export const cartTotalPriceState = selector<number>({
  key: "cartTotalPrice",
  get: ({ get }) => {
    const cart = get(cartState);
    const products = get(productState);
    const result = cart.listOrder.reduce(
      (total, item) =>
        total +
        Number(item.order.quantity) *
          Number(products.find((product) => product.id === item.id)?.sale_price),
      0
    );
    return result;
  },
});

export const headerState = atom<HeaderType>({
  key: "header",
  default: {},
});

export const searchProductState = atom<string>({
  key: "searchProduct",
  default: "",
});

export const activeCateState = atom<number>({
  key: "activeCate",
  default: 0,
});

export const activeFilterState = atom<string>({
  key: "activeFilter",
  default: filter[0].key,
});

export const storeProductResultState = selector<Product[]>({
  key: "storeProductResult",
  get: ({ get }) => {
    get(activeCateState);
    get(searchProductState);

    const store = get(storeState);
    const pos = getRandomInt(store.listProducts.length - 122, 0);
    const num = getRandomInt(120, 50);
    return [...store.listProducts.slice(pos, pos + num)];
  },
});

export const addressState = atom<Address>({
  key: "address",
  default: {
    street_1: "",
    street_2: "",
    city: "",
    zip: "",
    country: "",
    state: ""
  },
});

export const openProductPickerState = atom<boolean>({
  key: "openProductPicker",
  default: false,
});
export const openCouponPickerState = atom<boolean>({
  key: "openCouponPicker",
  default: false,
});
export const openPaymentMethodPickerState = atom<boolean>({
  key: "openPaymentMethodPicker",
  default: false,
});
export const openProductsPickerState = atom<boolean>({
  key: "openProductsPicker",
  default: false,
});
export const openStoresPickerState = atom<boolean>({
  key: "openStoresPicker",
  default: false,
});
export const openTimePickerState = atom<boolean>({
  key: "openTimePicker",
  default: false,
});
export const openAddressPickerState = atom<boolean>({
  key: "openAddressPicker",
  default: false,
});

export const branchValState = atom<number>({
  key: "branchVal",
  default: 0,
});

//2: Den lay tai cua hang
//1: Giao tan noi
export const branchTypeState = atom<number>({
  key: "branchType",
  default: 1,
});
export const initialProductInfoPickedState = {
  product: {
    id: -1,
    name: "",
    slug: "",
    type: "",
    store: {
      id: -1
    }
  },
  isBuyNow: false,
  currentItem: null
};
export const userEditingAddressState = atom<Address>({
  key: "userEditingAddress",
  default: {
    name:'',
    phone: '',
    email: '',
    address:''
  },
});

export const userAddressesState = atom<Address[]>({
  key: "userAddresses",
  default: [],
});
/*
export const userAddressesState = selector<Address[]>({
  key: "userAddresses",
  get: async ({ get }) => {
    return useraddresses
  },
});*/
export const productInfoPickedState = atom<ProductInfoPicked>({
  key: "productInfoPicked",
  default: initialProductInfoPickedState,
});
export const pageGlobalState = atom<PageGolobal>({
  key: "pageGlobal",
  default: {
    errMsg:""
  } as PageGolobal,
});
