const fs = require('fs');
const mongoose = require('mongoose');
// const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
// dotenv.config({ path: './config/config.env' });
const {
  MONGO_USERNAME = 'thaneshwor',
  MONGO_PASSWORD = '4RUM33zPgeAkxMD',
  MONGO_DATABASE = 'fk_ecommerce',
} = process.env;

const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.oihqw.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`;

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

// Load models
const Category = require('./models/category.modal');
const AdCategory = require('./models/adProduct.modal');
const Product = require('./models/Product.product.modal');

// Connect to DB
mongoose.connect(MONGO_URI, MONGO_OPTIONS);

// Read JSON files
const category = JSON.parse(fs.readFileSync(`${__dirname}/_data/categories.json`, 'utf-8'));

const adcategory = JSON.parse(fs.readFileSync(`${__dirname}/_data/adCategories.json`, 'utf-8'));

const product = JSON.parse(fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8'));

// Import into DB
const importData = async () => {
  try {
    await Category.create(category);
    await AdCategory.create(adcategory);
    await Product.create(product);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Category.deleteMany();
    await AdCategory.deleteMany();
    await Product.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
