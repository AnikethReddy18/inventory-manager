import { query } from "express";
import pool from "./pool.js";

const getAll = `
SELECT products.id AS id, products.name AS name, companies.name AS company, categories.name AS category, products.count
FROM products 
JOIN companies ON products.id = companies.product_id 
JOIN categories ON products.id = categories.product_id
`

export async function getProducts() {
    const result = await pool.query(getAll);
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
    const results = await pool.query(getAll+ "WHERE companies.name = $1", [company]);
    return results.rows;
}


export async function getCategories(){
    const result = await pool.query("SELECT DISTINCT name FROM categories");
    const categories = result.rows.map((row)=>row.name);
    return categories;
}

export async function getProductsByCategory(category){
    const results = await pool.query(getAll+"WHERE categories.name = $1", [category]);
    return results.rows;
}

export async function getProductsByQuery(name, company, category){
    const nameComanyCategory = getAll + `
    WHERE products.name = $1
    AND companies.name = $2
    AND categories.name = $3
    `
    const nameComany = getAll + `
    WHERE products.name = $1
    AND companies.name = $2
    `
    const nameCategory = getAll + `
    WHERE products.name = $1
    AND categories.name = $2
    `
    const comanyCategory = getAll + `
    AND companies.name = $1
    AND categories.name = $2
    `
    

    if(name&&company&&category){
        const results = await pool.query(nameComanyCategory, [name, company, category]);
        return results.rows;
        
    }
    else if(name&&company){
        const results = await pool.query(nameComany, [name, company]);
        return results.rows;
    }
    else if(name&&category){
        const results = await pool.query(nameCategory, [name, category]);
        return results.rows;
    }
    else if(company&&category){
        const results = await pool.query(comanyCategory, [company, category]);
        return results.rows;
    }
    else if(name){
        const results = await pool.query(getAll+"WHERE products.name = $1", [name]);
        return results.rows;
    }
    else if(company){
        return await getProductsByCompany(company);
    }
    else if(category){
        return await getProductsByCategory(category);
    }
    else{
        return await getProducts();
    }
}


export async function deleteProduct(id){
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    await pool.query("DELETE FROM companies WHERE product_id = $1", [id]);
    await pool.query("DELETE FROM categories WHERE product_id = $1", [id]);
}