import { SimpleItem } from "./index";

const mapStringToSimpleItem: (s: string) => SimpleItem = (s) => {
  return { id: s, text: s };
};
export const fruits: SimpleItem[] = ["mango", "apple", "orange"].map(
  mapStringToSimpleItem
);

export const vegetables: SimpleItem[] = [
  "spinach",
  "lady finger",
  "potato",
  "onion"
].map(mapStringToSimpleItem);

export const meats: SimpleItem[] = ["chicken", "pig", "fish", "turkey"].map(
  mapStringToSimpleItem
);
