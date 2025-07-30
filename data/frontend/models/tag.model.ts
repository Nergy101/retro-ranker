export interface TagModel {
  id: string;
  name: string;
  slug: string;
  type:
    | "brand"
    | "formFactor"
    | "releaseDate"
    | "price"
    | "os"
    | "personalPick"
    | "screenType"
    | "deviceType";
}

export const TAG_FRIENDLY_NAMES = {
  brand: "Brand",
  formFactor: "Form Factor",
  releaseDate: "Release Date",
  price: "Price",
  os: "OS",
  personalPick: "Personal Pick",
  screenType: "Screen Type",
  deviceType: "Device Type",
};
