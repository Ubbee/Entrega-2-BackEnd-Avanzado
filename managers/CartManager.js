import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async _ensureFile() {
    if (!fs.existsSync(this.path)) {
      await fs.promises.writeFile(this.path, "[]");
    }
  }

  async getCarts() {
    await this._ensureFile();

    const data = await fs.promises.readFile(this.path, "utf-8");

    try {
      return JSON.parse(data);
    } catch (e) {
      await fs.promises.writeFile(this.path, "[]");
      return [];
    }
  }

  async saveCarts(carts) {
    await this._ensureFile();
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: Date.now().toString(),
      products: []
    };

    carts.push(newCart);
    await this.saveCarts(carts);

    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === id);
    return cart || null;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();

    const cartIndex = carts.findIndex((c) => c.id === cid);
    if (cartIndex === -1) return null;

    const productsInCart = carts[cartIndex].products;
    const productIndex = productsInCart.findIndex((p) => p.product === pid);

    if (productIndex === -1) {
      productsInCart.push({ product: pid, quantity: 1 });
    } else {
      productsInCart[productIndex].quantity += 1;
    }

    await this.saveCarts(carts);
    return carts[cartIndex];
  }
}