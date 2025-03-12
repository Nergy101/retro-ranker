import { BaseEntity } from "./base.entity.ts";

export interface TagModel extends BaseEntity {
  name: string;
  slug: string;
  type:
    | "brand"
    | "formFactor"
    | "releaseDate"
    | "price"
    | "os"
    | "personalPick"
    | "screenType";
}
