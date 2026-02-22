import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./data/carts.json");

const handleError = (res, error, msg = "Error interno") => {
  console.error(msg, error);
  return res.status(500).json({ error: msg });
};

/* ------------------- CREAR CARRITO ------------------- */
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    return res.status(201).json(newCart);
  } catch (error) {
    return handleError(res, error, "Error al crear carrito");
  }
});

/* ------------------- OBTENER CARRITO POR ID ------------------- */
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Devuelvo solo los productos como pide la consigna
    return res.json(cart.products);
  } catch (error) {
    return handleError(res, error, "Error al obtener carrito");
  }
});

/* ------------------- AGREGAR PRODUCTO AL CARRITO ------------------- */
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartManager.addProductToCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    return res.json(updatedCart);
  } catch (error) {
    return handleError(res, error, "Error al agregar producto al carrito");
  }
});

export default router;