import { Router } from "express";
import { getCompanies, getProductsByCompany } from "../db/queries.js";

const router = Router();

router.get("/", (req, res)=>{
    getCompanies().then((companies)=>res.render("types", {types: companies,  currRoute: "companies"}))
})

router.get("/:company",(req, res)=>{
    getProductsByCompany(req.params.company).then((products)=>res.render("products", {products}))
})

export default router;
