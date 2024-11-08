import { Router } from "express";
import { getCompanies, getProductsByCompany } from "../db/queries.js";

const router = Router();

router.get("/", (req, res)=>{
    getCompanies().then((companies)=>res.render("types", {types: companies,  currRoute: "categories"}))
})

router.get("/:company", (req, res)=>{
    getProductsByCompany(req.params.company).then((products)=>res.render("home", {products}))
})

export default router;
