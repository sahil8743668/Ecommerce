class SearchEngine {

  constructor(products) {
    this.products = products;
    this.index = {};
    this.buildIndex();
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/);
  }

  buildIndex() {
    this.products.forEach(product => {

      const words = this.tokenize(
        product.name + " " + product.description
      );

      words.forEach(word => {

        if (!this.index[word]) {
          this.index[word] = [];
        }

        this.index[word].push(product);

      });

    });
  }

  search(query) {

    const words = this.tokenize(query);
    let results = [];

    words.forEach(word => {

      if (this.index[word]) {
        results = results.concat(this.index[word]);
      }

    });

    return [...new Set(results)];
  }

}

module.exports = SearchEngine;