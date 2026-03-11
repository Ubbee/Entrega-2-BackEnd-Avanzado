const socket = io();

const form = document.getElementById("productForm");
const productList = document.getElementById("productList");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    status: true,
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
    thumbnails: []
  };

  socket.emit("newProduct", product);
  form.reset();
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}

socket.on("updateProducts", (products) => {
  productList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${product.title} - $${product.price}
      <button onclick="deleteProduct('${product.id}')">Eliminar</button>
    `;
    productList.appendChild(li);
  });
});