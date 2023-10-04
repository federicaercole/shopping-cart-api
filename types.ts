import { RowDataPacket } from "mysql2";

export interface ResponseError extends Error {
    status?: number;
}

export interface Product extends RowDataPacket {
    name: string;
    price: number;
    url: string;
    images_small: string;
}

export interface ProductDetails extends Product {
    description: string;
    quantity: number;
    images_big: string;
}

export interface Category extends RowDataPacket {
    category: string;
}
