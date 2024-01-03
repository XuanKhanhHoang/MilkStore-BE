type variationInfo = {
  VARIATION_ID: number;
  PRICE: number;
  UNIT: number;
  AMOUNT: number;
  product: {
    PRODUCT_LOGO_IMAGE: string;
    PRODUCT_NAME: string;
  };
};
export type cartItem = {
  vid: Number;
  amount: Number;
};
export type cartVariations = {
  vid: Number;
}[];
