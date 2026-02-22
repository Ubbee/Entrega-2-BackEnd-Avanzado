import fs from "fs";

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async _ensureFile() {
        if (!fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path, "[]");
        }
    }

    async getProducts() {
        await this._ensureFile();

        const data = await fs.promises.readFile(this.path, "utf-8");

        try {
            return JSON.parse(data);
        } catch (e) {
            await fs.promises.writeFile(this.path, "[]");
            return [];
        }
    }

    async saveProducts(products) {
        await this._ensureFile();
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find((p) => p.id === id);
        return product || null;
    }

    async addProduct(product) {
        const products = await this.getProducts();

        const newProduct = {
            ...product,
            id: Date.now().toString()
        };

        products.push(newProduct);
        await this.saveProducts(products);

        return newProduct;
    }

    async updateProduct(id, updateData) {
        const products = await this.getProducts();

        const index = products.findIndex((p) => p.id === id);
        if (index === -1) return null;

        if ("id" in updateData) delete updateData.id;

        const updated = {
            ...products[index],
            ...updateData,
            id: products[index].id
        };

        products[index] = updated;
        await this.saveProducts(products);

        return updated;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();

        const exists = products.some((p) => p.id === id);
        if (!exists) return null;

        const newList = products.filter((p) => p.id !== id);
        await this.saveProducts(newList);

        return true;
    }
}