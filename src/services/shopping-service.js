const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");

class ShoppingService {
    constructor() {
        this.repository = new ShoppingRepository();
    }

    async PlaceOrder(userInput) {
        const { _id, txnNumber } = userInput;

        try {
            const orderResult = await this.repository.CreateNewOrder(
                _id,
                txnNumber
            );
            return FormateData(orderResult);
        } catch (error) {
            throw new APIError("Data Not found", error);
        }
    }

    async GetOrder(customerId) {
        try {
            const orders = await this.repository.Orders(customerId);
            return FormateData(orders);
        } catch (error) {
            throw new APIError("Data Not found", error);
        }
    }
}

module.exports = ShoppingService;
