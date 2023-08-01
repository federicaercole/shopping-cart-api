const sql = require('../config');
const ash = require('express-async-handler');

async function getCategoryIdByUrl(categoryUrl) {
    const [category] = await sql.query("SELECT id FROM categories WHERE name = ?", categoryUrl);
    return category[0].id;
}

async function getProductsbyCategory(url) {
    const categoryId = await getCategoryIdByUrl(url);
    const [products] = await sql.query("SELECT name, price FROM products WHERE category = ?", categoryId);
    return products;
}

async function getProduct(url) {
    const [product] = await sql.query("SELECT name, price, description, quantity, url, images_big, images_small FROM products WHERE url = ?", url);
    return product[0];
}

const getSingleProduct = ash(async (req, res) => {
    const product = await getProduct(req.params.id);
    res.json(product);
});

const getProducts = ash(async (req, res) => {
    const products = await getProductsbyCategory(req.params.category);
    res.json(products);
});

module.exports = { getProducts, getSingleProduct };