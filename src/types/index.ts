export type CategoryId =
  | "plov"
  | "lagman"
  | "manty"
  | "shashlik"
  | "salads"
  | "soups"
  | "desserts"
  | "drinks";

export type BadgeKind = "popular" | "new" | "spicy" | "veg";

export interface Category {
  id: CategoryId;
  label: string;
}

export interface SizeOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface Dish {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  price: number;
  weight: number; // grams (ml for drinks)
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  rating: number;
  reviews: number;
  cookTime: number; // minutes
  images: string[];
  badges: BadgeKind[];
  ingredients: string[];
  allergens: string[];
  sizes?: SizeOption[];
  extras: AddOn[];
  sauces: AddOn[];
}

export interface CartLine {
  key: string; // dishId + config hash
  dishId: string;
  name: string;
  image: string;
  qty: number;
  unitPrice: number; // base + size + add-ons
  sizeLabel?: string;
  addOns: string[]; // names, for display
  note?: string;
}

export interface Restaurant {
  name: string;
  tagline: string;
  heroImage: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  hours: string;
  distance: string;
  deliveryFee: number;
  freeDeliveryOver: number;
  minOrder: number;
  address: string;
}
