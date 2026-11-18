import { Category } from "./category";

export interface Product{
    id:number;
    slug:string;
    category_id:number;
    supplier_id:number | null
    title:string;
    description:string;
    price:number;
    sale_price:number;
    stock:number;
    images:string[];
    category:Category
}