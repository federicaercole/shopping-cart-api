import sql from '../config';
import ash from 'express-async-handler';
import { query, validationResult } from "express-validator";
import { Product, Category, ProductDetails } from '../types';

async function getCategoryIdByUrl(categoryUrl: string) {
    const [category] = await sql.query<Category[]>("SELECT id FROM categories WHERE name = ?", categoryUrl);
    return category[0];
}

async function getProductsbyCategory(filter: string, categoryId: number) {
    let query = `SELECT products.name, price, images_small, url, categories.name AS category FROM products
    JOIN categories ON products.category = categories.id WHERE category = ?`;
    query += filter;
    const [products] = await sql.query<Product[]>(query, categoryId);
    return products;
}

async function getProduct(url: string) {
    const [product] = await sql.query<ProductDetails[]>("SELECT name, price, description, quantity, url, images_big, images_small FROM products WHERE url = ?", url);
    return product[0];
}

async function getLatestProducts() {
    const [products] = await sql.query<Product[]>(`SELECT products.name, price, images_small, url, categories.name AS category FROM products
    JOIN categories ON products.category = categories.id ORDER BY date DESC LIMIT 5`);
    return products;
}

async function getBestSellingProducts() {
    const [products] = await sql.query<Product[]>(`SELECT products.name, price, images_small, url, categories.name AS category FROM products
    JOIN categories ON products.category = categories.id ORDER BY total_sold DESC LIMIT 5`);
    return products;
}

async function getFavoriteProducts() {
    const [products] = await sql.query<Product[]>(`SELECT products.name, price, images_small, url, categories.name AS category FROM products
    JOIN categories ON products.category = categories.id
    WHERE highlight='1' ORDER BY date DESC LIMIT 5`);
    return products;
}

const getProductsFilter = (query: string = "") => {
    let filter = "";
    switch (query) {
        case "alphabeticalAZ":
            filter += " ORDER BY name ASC";
            break;
        case "alphabeticalZA":
            filter += " ORDER BY name DESC";
            break;
        case "priceLH":
            filter += " ORDER BY price ASC";
            break;
        case "priceHL":
            filter += " ORDER BY price DESC";
            break;
        default:
            filter += " ORDER BY date DESC";
            break;
    }
    return filter;
};

const searchInputValidation = query("s", "Please write a valid keyword to start a search").trim().notEmpty().escape();

export const getSingleProduct = ash(async (req, res, next) => {
    const product = await getProduct(req.params.id);
    if (!product) {
        return next();
    }
    res.json(product);
});

export const getProducts = ash(async (req, res, next) => {
    const { sort } = req.query as { [key: string]: string };
    const category = await getCategoryIdByUrl(req.params.category);
    if (!category) {
        return next();
    }
    const categoryId: number = category.id;
    const filter = getProductsFilter(sort);
    const products = await getProductsbyCategory(filter, categoryId);
    res.json(products);
});

export const getHomeProducts = ash(async (_req, res) => {
    const latestProducts = await getLatestProducts();
    const bestSellingProducts = await getBestSellingProducts();
    const favoriteProducts = await getFavoriteProducts();
    res.json({ latestProducts, bestSellingProducts, favoriteProducts });
});

export const getSearchResults = [
    searchInputValidation,
    ash(async (req, res): Promise<any> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ message: errors.array()[0].msg as string });
        }
        const { s, sort } = req.query as { [key: string]: string };
        const filter = getProductsFilter(sort);
        let query = `SELECT products.name, price, images_small, url, categories.name AS category FROM products
    JOIN categories ON products.category = categories.id WHERE products.name LIKE ? OR description LIKE ?`;
        query += filter;
        const [results] = await sql.query<Product[]>(query, [`%${s}%`, `%${s}%`]);
        return res.json(results);
    })];