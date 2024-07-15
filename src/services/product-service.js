const { ProductRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");

class ProductService {
    constructor() {
        this.repository = new ProductRepository();
    }

    async CreateProduct(productInputs) {
        try {
            const productResult = await this.repository.CreateProduct(
                productInputs
            );
            return FormateData(productResult);
        } catch (error) {
            throw new APIError("Data not found");
        }
    }

    async GetProducts() {
        try {
            const products = await this.repository.Products();

            let categories = {};

            products.map(({ type }) => {
                categories[type] = type;
            });

            return FormateData({
                products,
                categories: Object.keys(categories),
            });
        } catch (error) {
            throw new APIError("Data not found");
        }
    }

    async GetProductDescription(productId) {
        try {
            const product = await this.repository.FindById(productId);
            return FormateData(product);
        } catch (error) {
            throw new APIError("Data not found");
        }
    }

    async GetProductByCategory(category) {
        try {
            const products = await this.repository.FindByCategory(category);
            return FormateData(products);
        } catch (error) {
            throw new APIError("Data not found");
        }
    }

    async GetSelectedProducts(selectedIds) {
        try {
            const products = await this.repository.FindSelectedProducts(
                selectedIds
            );
            return FormateData(products);
        } catch (error) {
            throw new APIError("Data not found");
        }
    }

    async GetProductById(productId) {
        try {
            return await this.repository.FindById(productId);
        } catch (error) {
            throw new APIError("Data not found");
        }
    }
}

module.exports = ProductService;
