export interface TagModel {
  name: string;
  slug: string;
  type:
    | "brand"
    | "formFactor"
    | "releaseDate"
    | "price"
    | "os"
    | "personalPick";
}
