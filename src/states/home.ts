import { atom, selector } from "recoil";
import {
    Category, Coupon, PaymentMethod,
    Product, Province, District, Branch
} from "../models";
import WooWorker from "../services/WooWorker";
import categories from "../mock/categories.json";
import products from "../mock/products.json";
import coupons from "../mock/coupons.json";
import provinces from "../mock/provinces.json";
import districts from "../mock/districts.json";
import branchs from "../mock/branchs.json";

export const homeCategoriesState = selector<Category[]>({
    key: "homeCategories",
    get: async ({ get }) => {
        //const catJson = await WooWorker.getCategories();
        //return catJson ;
        return categories;
    },
});

export const couponsState = selector<Coupon[]>({
    key: "allcoupons",
    get: async ({ get }) => {
        return coupons;
    },
});

export const homeProductsState = selector<Product[]>({
    key: "homeProducts",
    get: async ({ get }) => {
        //const productsJson = await WooWorker.getAllProducts(10,1);
        //return productsJson;
        return products;
    },
});
export const homeFeaturedProductsState = selector<Product[]>({
    key: "homeFeaturedProducts",
    get: async ({ get }) => {
        //const productsJson = await WooWorker.getAllProducts(10,1,true);
        //return productsJson;
        return products.filter(p => p.on_sale === 1)
    },
});

export const provincesState = selector<Province[]>({
    key: "provinces",
    get: async ({ get }) => {
        return provinces;
    },
});
export const districtsState = selector<District[]>({
    key: "districts",
    get: async ({ get }) => {
        return districts;
    },
});
export const branchsState = selector<Branch[]>({
    key: "branchs",
    get: async ({ get }) => {
        return branchs;
    },
});
