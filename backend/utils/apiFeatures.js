class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: 'i' } }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const exclude = ['keyword', 'page', 'limit', 'sort'];
    exclude.forEach(k => delete queryObj[k]);

    // Price range: price[gte]=100&price[lte]=500
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, m => `$${m}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate(resPerPage = 12) {
    const page = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (page - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
