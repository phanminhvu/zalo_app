import {ReactNode} from "react";

export type OrderStatus = "pending" | "shipping" | "finish";

export type Options = {
  name: string;
  title: string;
  option: {
    value: string;
    label: string;
    checked?: boolean;
  }[];
};

export type CartProduct = {
  product_id: number;
  name: string;
  image: string;
  sale_price:  number | string;
  price: number | string;
  quantity: number;
  selected: boolean;
  parent: number;
  user_note: string;
};
export type CartData = {
  cartItems: CartProduct[];
  //selectedStores: CartDataStore[];
  totalCart: number;
  totalCheckout: number;
  isFetching?: boolean;
};
export type Category = {
  id: number;
  name: string;
  image: Image;
  parent: number;
};
export type Coupon = {
  id: number;
  code: string;
  amount: string;
  status: number;
  date_created?: string;
  date_modified?: string;
  discount_type?: string;
  description?: string;
  date_expires?: any;
  usage_count?: number;
  product_ids?: any[];
  excluded_product_ids?: any[];
  usage_limit?: any;
  usage_limit_per_user?: any;
  product_categories?: any[];
  excluded_product_categories?: any[];
  minimum_amount?: string;
  maximum_amount?: string;
};
export type renderedContent = {
  rendered: string;
}
export type NewItem = {
  id: number;
  image: string;
  title: string;
  content: string;
  short_content: string;
}
export type Product = {
  id: number;
  image?: string;
  name: string;
  category_id: number;
  price: number;
  sale_price:number;
  on_sale:number;
  description:string;
  related_products: number[];
};
export type Payment = {
  paypal?: string[];
  bank?: string[];
};
export type Rating = {
  rating?: string;
  count?: number;
};
export type Social = {
  fb?: string,
  twitter?: string,
  pinterest?: string,
  linkedin?: string,
  youtube?: string,
  instagram?: string,
  flickr?: string
}
export type Store = {
  id: number;
  logoStore: string;
  bannerStore: string;
  nameStore: string;
  followers: number;
  address: string;
  type: "personal" | "business";
  categories: string[];
  listProducts: Product[];
};

export type StoreOrder = {
  status: OrderStatus;
  listOrder: CartProduct[];
  date: Date;
  address?: Address;
};

export type SectionProductsProps = {
  id: number;
  title: string;
  watchMore?: boolean;
  pathBanner?: string;
  direction?: "vertical" | "horizontal";
  colPercentage?: number;
  children?: (data: Product | Store) => ReactNode;
  data: any;
  onChoose?: () => void;
};

export type OrderStoreProps = {
  keyStore: number;
  listPickupItems: { keyItem: number; quantity: number }[];
};
export type ShippingDate = {
  date?: string;
  hour?: number;
  minute?: number;
};
export type Address = {
  id: number | 0;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  default?:boolean;
};

export type HeaderType = {
  route?: string;
  hasLeftIcon?: boolean;
  title?: string;
  customTitle?: ReactNode;
  type?: "primary" | "secondary";
  rightIcon?: ReactNode;
  showBottomBar?: boolean;
  showAvatar?: boolean;
  showSearch?: boolean;
  onSearchChange?: any;
  onSearchButtonClick?: any;
  showCart?: boolean;
  showTotalCart?: boolean;
};

export type AddressFormType = {
  name: "detail" | "city" | "district" | "ward";
  label: string;
  type: "text" | "select";
  placeholder: string;
  isValidate: boolean;
  errorMessage?: string;
};
export type AttributeDataPicked = {
  attr_name: string;
  slug: string;
}
export type ProductInfoPicked = {
  product: Product;
  isBuyNow?: boolean;
  currentItem?: CartProduct;
};
export type ConfirmButton = {
  label: string;
  action?:any;
  type?:string;
  isCLosed?: boolean;
}
export type ConfirmModal = {
  buttons?: ConfirmButton[];
  showModal?:boolean;
  title?:string;
  description?: string;
}
export type PageGolobal = {
  errMsg: string;
  confirmModal?: ConfirmModal;
};

export type Customer = {
  first_name: string;
  last_name?: string;
  address_1?: string;
  state?: string;
  postcode?: string;
  country?: string;
  email: string;
  phone: string;
  note?: string;
};

export type ShippingMethodSettingCost = {
  id: string;
  label: string;
  description: string;
  type: string;
  value: number | string;
  default: string;
  tip: string;
}
export type ShippingMethodSetting = {
  cost:ShippingMethodSettingCost;
}
export type ShippingMethod = {
  id: number;
  instance_id?: number;
  title: string;
  order?: number;
  enabled?: boolean,
  method_id?: string;
  method_title?: string;
  method_description?: string;
  settings?: ShippingMethodSetting;
}
export type PaymentMethod = {
  id: number | 0;
  title?: string;
  order?: number;
  enabled?: boolean,
  notes?: string;
}
/*
export type User = {
  id: number;
  zaloId: string;
  followerId: string;
  birthday?: string;
  name: string;
  gender: string;
  phone?:string;
  email?:string;
  picture: string;
  status: string;
  isFollowing: boolean;
}*/
export type User = {
  id?: string;
  idByOA?: string;
  followedOA?: boolean;
  name?: string;
  phone?:string;
  email?:string;
  birthday?:string|number|Date;
  avatar?: string;
  isSensitive?: boolean;
}
export type AuthData = {
  token: string;
  profile: User;
}

export type IconMenuProps = {
  image: string;
  label: string;
  imageSize: number;
  textSize: string;
  onClick: any;
  imageType: string;
  outClass: string;
}
export type IconTextProps = {
  icon: string;
  label: string;
  size: number;
  textSize: string;
  onClick: any;
  outClass: string;
  iconColor?: string;
}
export type OrderLineItemMeta = {
  id: number;
  key: string;
  value: string;
  display_key: string;
  display_value: string;
}


export type BacsInfo = {
  account_name: string;
  account_number: string;
  bank_name: string;
  sort_code: string;
  iban: string;
  bic: string;
}
export type OrderStore = {
  id: number;
  name: string;
  shop_name: string;
  url: string;
  address: Address;
}
export type Order = {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  total: string;
  customer_id: number;
  shipping: Address;
  payment_method: string;
  payment_method_title: string;
  created_via: string;
  date_completed: any;
  shipping_date: ShippingDate;
  branch_id: number;
  branch_type: number;
  line_items: OrderLineItem[];

}
export type OrderLineItem = {
  id: number;
  name: string;
  parent: number;
  quantity: number;
  subtotal: string;
  price: number;
  image: string;
  user_note: string;
}
export type Province = {
  code: number;
  name: string;
}
export type District = {
  code: number;
  name: string;
  province_code: number;
}
export type Branch = {
  id:number;
  district:number;
  province: number;
  name: string;
  address: string;
}
export type AllData = {
  categories: Category[];
  products: Product[];
  provinces: Province[];
  districts: District[];
  branchs: Branch[];
  coupons: Coupon[];
}
