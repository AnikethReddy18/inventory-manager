import { Router } from "express";
import { getCategories, getProductsByCategory} from "../db/queries.js";

const router = Router();

router.get("/", (req, res)=>{
    getCategories().then((categories)=>res.render("types", {types: categories, currRoute: "categories"}))
})

router.get("/:category", (req, res)=>{
    getProductsByCategory(req.params.category).then((products)=>res.render("home", {products}))
})

export default router;