class RecommendationEngine {

  static recommend(product, allProducts) {

    return allProducts.filter(p => {

      return (
        p.category.toString() === product.category.toString() &&
        p._id.toString() !== product._id.toString()
      );

    }).slice(0, 5);

  }

}

module.exports = RecommendationEngine;