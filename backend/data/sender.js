const mongoose = require("mongoose")
const dotenv = require("dotenv")

const Product = require("../models/Product")
const Category = require("../models/Category")
const products = require("./products")

// load .env from backend folder
dotenv.config({ path: "../.env" })

mongoose.connect(process.env.MONGO_URI)

const seedProducts = async () => {

try {

// पुराने products delete नहीं होंगे

for (let product of products) {

const category = await Category.findOne({ slug: product.category })

if (!category) continue

product.category = category._id

await Product.create(product)

}

console.log("Products Added Successfully")

process.exit()

} catch (error) {

console.log(error)

process.exit(1)

}

}

seedProducts()