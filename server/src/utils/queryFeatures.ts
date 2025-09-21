import { Document, Query } from "mongoose";
import { ParsedQs } from "qs"; // Import ParsedQs from 'qs' or '@types/express'

// Define a flexible QueryString interface
interface QueryString extends ParsedQs {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string | string[];
}

interface QueryFeaturesOptions<T extends Document> {
  query: Query<any[], T>; // Use 'any[]' for results, T for document type
  queryString: QueryString;
}

class QueryFeatures<T extends Document> {
  query: Query<any[], T>;
  queryString: QueryString;

  constructor(options: QueryFeaturesOptions<T>) {
    this.query = options.query;
    this.queryString = options.queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = Array.isArray(this.queryString.fields)
        ? this.queryString.fields.join(" ")
        : this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // Avoid sensitive fields
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;

    console.log(limit);
    

    if (page < 1 || limit < 1) {
      throw new Error("Page and limit must be positive numbers");
    }

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default QueryFeatures;