const {faker} = require("@faker-js/faker");

const generateProducts = () =>{


    const numeroDeProductos = parseInt(faker.string.numeric());

    let productos = [];

    for (let i = 0; i < numeroDeProductos; i++ ) {
        productos.push(generateProducts());
    }
    
    return{
        id:faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description:faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: parseInt(faker.string.numeric()),
        category: faker.commerce.department()
    }
}

module.exports = generateProducts;