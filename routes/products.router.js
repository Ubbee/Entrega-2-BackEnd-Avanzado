import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

const handleError = (res, error, msg = "Error interno") => {
    console.error(msg, error);
    return res.status(500).json({ error: msg });
};

const validateProductBody = (body) => {
    const { title, description, code, price, stock, category } = body;

    if (!title || !description || !code || price === undefined || stock === undefined || !category) {
        return false;
    }
    return true;
};

/* ------------------- GET TODOS --------------- */
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        return res.json(products);
    } catch (error) {
        return handleError(res, error, "Error al obtener productos");
    }
});

/* ------------------- GET POR ID ------------------- */
router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await productManager.getProductById(pid);
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });

        return res.json(product);
    } catch (error) {
        return handleError(res, error, "Error al buscar producto");
    }
});

/* ----------------- CREAR ----------------- */
router.post("/", async (req, res) => {
    try {
        if (!validateProductBody(req.body)) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        const {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        } = req.body;

        const productToCreate = {
            title,
            description,
            code,
            price: Number(price),
            status: status ?? true,
            stock: Number(stock),
            category,
            thumbnails: Array.isArray(thumbnails) ? thumbnails : []
        };

        const created = await productManager.addProduct(productToCreate);
        return res.status(201).json(created);
    } catch (error) {
        return handleError(res, error, "Error al crear producto");
    }
});

/* --------------------- ACTUALIZAR ------------------- */
router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;

        const updateData = { ...req.body };

        if ("id" in updateData) delete updateData.id;

        const updated = await productManager.updateProduct(pid, updateData);
        if (!updated) return res.status(404).json({ error: "Producto no encontrado" });

        return res.json(updated);
    } catch (error) {
        return handleError(res, error, "Error al actualizar producto");
    }
});

/* ------------------- ELIMINAR -------------------------- */
router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;

        const deleted = await productManager.deleteProduct(pid);
        if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });

        return res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        return handleError(res, error, "Error al eliminar producto");
    }
});

export default router;