import pool from "./pool.js";

const getAll = `
SELECT products.name AS name, companies.name AS company, categories.name AS category, products.count
FROM products 
JOIN companies ON products.id = companies.product_id 
JOIN categories ON products.id = categories.product_id;
`

const getByCompany = `
SELECT products.name AS name, companies.name AS company, categories.name AS category, products.count
FROM products 
JOIN companies ON products.id = companies.product_id 
JOIN categories ON products.id = categories.product_id
WHERE companies.name = $1;
`
const getByCategory = `
SELECT products.name AS name, companies.name AS company, categories.name AS category, products.count
FROM products 
JOIN companies ON products.id = companies.product_id 
JOIN categories ON products.id = categories.product_id
WHERE categories.name = $1;
`

export async function getProducts() {
    const result = await pool.query(getAll)
    return result.rows;
}

export async function addProduct({ name, id, count, company, category }) {
    await pool.query("INSERT INTO products  VALUES ($1::integer, $2::text, $3::integer)", [id, name, count]);
    await pool.query("INSERT INTO companies  VALUES ($1::integer, $2::text)", [id, company]);
    await pool.query("INSERT INTO categories  VALUES ($1::integer, $2::text)", [id, category]);
}

export async function getCompanies(){
    const result = await pool.query("SELECT DISTINCT name FROM companies ");
    const companies = result.rows.map((row)=>row.name);
    return companies;
}

export async function getProductsByCompany(company){
    const results = await pool.query(getByCompany, [company]);
    return results.rows;
}


export async function getCategories(){
    const result = await pool.query("SELECT DISTINCT name FROM categories");
    const categories = result.rows.map((row)=>row.name);
    return categories;
}

export async function getProductsByCategory(category){
    const results = await pool.query(getByCategory, [category]);
    return results.rows;
}