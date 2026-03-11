import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
console.log("entre al views router");
const router = Router();
const productManager = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    res.status(500).send("Error al cargar la vista home");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).send("Error al cargar la vista realtime");
  }
});

export default router;