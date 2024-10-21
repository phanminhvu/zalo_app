import { CartProduct } from "../models";

export const calcSalePercentage = (
  salePrice: string | number,
  retailPrice: string | number
) => (Number(retailPrice) > 0 ? Math.floor((1 - Number(salePrice) / Number(retailPrice)) * 100) : 0);

export const getRandomInt = (max: number, min: number = 1): number => {
  min = Math.floor(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};
