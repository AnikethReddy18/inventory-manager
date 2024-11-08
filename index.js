import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import companyRouter from "./routers/companyRouter.js"
import categoryRouter from "./routers/categoryRouter.js"
import { getProducts, addProduct } from "./db/queries.js";


const app = express();
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
const PORT = process.env.PORT || 3000;

app.get("/", (req, res)=>{
    getProducts().then((products)=>res.render("home", {products}))
})

app.use("/companies", companyRouter);
app.use("/categories", categoryRouter)

app.post("/newProduct", (req, res)=>{
    addProduct(req.body).then(()=>res.redirect("/"))
})


app.listen(PORT, ()=>{
    console.log("Server Live At: http://localhost:" + PORT)
})