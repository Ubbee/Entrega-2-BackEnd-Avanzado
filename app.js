import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager("./data/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  //enviar lista cuando alguien entra
  const products = await productManager.getProducts();
  socket.emit("updateProducts", products);

  //crear producto 
  socket.on("newProduct", async (productData) => {
    await productManager.addProduct(productData);

    const updatedProducts = await productManager.getProducts();
    io.emit("updateProducts", updatedProducts);
  });

  //eliminar producto
  socket.on("deleteProduct", async (productId) => {
    await productManager.deleteProduct(productId);

    const updatedProducts = await productManager.getProducts();
    io.emit("updateProducts", updatedProducts);
  });
});
app.get("/prueba", (req, res) => {
  res.send("ESTE ES EL APP CORRECTO");
});
console.log("views router cargado");
server.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});