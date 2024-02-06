const socket = io();

socket.on("products", (data) => {
  renderProducts(data);
});

//renderiza los productos

const renderProducts = (products) => {
  const conteinerProducts = document.getElementById("conteinerProducts");
  conteinerProducts.innerHTML = "";

  products.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
                    <p>${item.id}</p>
                    <p>${item.title}</p>
                    <p>${item.price}</p>
                    <button> Eliminar </button>       
        `;

    conteinerProducts.appendChild(card);

    //funcion pare eliminar
    card.querySelector("button").addEventListener("click", () => {
      deleteProduct(item.id);
    });
  });
};

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

//funcion para agregar

document.getElementById("btnSend").addEventListener("click", () => {
  addProduct();
});

const addProduct = () => {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    img: document.getElementById("img").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value,
  };

  socket.emit("addProduct", product);
};
