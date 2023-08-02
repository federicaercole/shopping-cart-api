const sql = require('../config');
const ash = require('express-async-handler');

async function getCategoryIdByUrl(categoryUrl) {
    const [category] = await sql.query("SELECT id FROM categories WHERE name = ?", categoryUrl);
    return category[0].id;
}

async function getProductsbyCategory(filter, url) {
    const categoryId = await getCategoryIdByUrl(url);
    let query = "SELECT name, price, images_small, url FROM products WHERE category = ?";
    query += filter;
    const [products] = await sql.query(query, categoryId);
    return products;
}

async function getProduct(url) {
    const [product] = await sql.query("SELECT name, price, description, quantity, url, images_big, images_small FROM products WHERE url = ?", url);
    return product[0];
}

async function getLatestProducts() {
    const [products] = await sql.query("SELECT name, price, images_small, url FROM products ORDER BY date DESC LIMIT 5");
    return products;
}

async function getBestSellingProducts() {
    const [products] = await sql.query("SELECT name, price, images_small, url FROM products ORDER BY total_sold DESC LIMIT 5");
    return products;
}

async function getFavoriteProducts() {
    const [products] = await sql.query("SELECT name, price, images_small, url FROM products WHERE highlight='1' ORDER BY date DESC LIMIT 5");
    return products;
}

const getProductsFilter = query => {
    let filter = "";
    switch (query) {
        case "alph-asc":
            filter += " ORDER BY name ASC";
            break;
        case "alph-desc":
            filter += " ORDER BY name DESC";
            break;
        case "price-asc":
            filter += " ORDER BY price ASC";
            break;
        case "price-desc":
            filter += " ORDER BY price DESC";
            break;
        default:
            filter += " ORDER BY date DESC";
            break;
    }
    return filter;
};

const getSingleProduct = ash(async (req, res) => {
    const product = await getProduct(req.params.id);
    res.json(product);
});

const getProducts = ash(async (req, res) => {
    const { sort } = req.query;
    const filter = getProductsFilter(sort);
    const products = await getProductsbyCategory(filter, req.params.category);
    res.json(products);
});

const getHomeProducts = ash(async (req, res) => {
    const latestProducts = await getLatestProducts();
    const bestSellingProducts = await getBestSellingProducts();
    const favoriteProducts = await getFavoriteProducts();
    res.json({ latestProducts, bestSellingProducts, favoriteProducts });
});

const getSearchResults = ash(async (req, res) => {
    const { s, sort } = req.query;
    const filter = getProductsFilter(sort);
    let query = `SELECT name, price, images_small, url FROM products WHERE description LIKE ? OR description LIKE ?`;
    query += filter;
    const [results] = await sql.query(query, [`%${s}%`, `%${s}%`]);
    res.json(results);
});

module.exports = { getProducts, getSingleProduct, getHomeProducts, getSearchResults };