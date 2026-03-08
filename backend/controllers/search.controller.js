const Product = require("../models/Product");
const SearchEngine = require("../utils/searchEngine");

exports.searchProducts = async (req, res) => {

  const { q } = req.query;

  const products = await Product.find();

  const engine = new SearchEngine(products);

  const results = engine.search(q);

  res.json({
    success: true,
    results
  });

};