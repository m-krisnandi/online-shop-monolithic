const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
    const customerService = new CustomerService();

    app.get("/shopping/cart", UserAuth, async (req, res, next) => {
        const { _id } = req.user;

        try {
            const { data } = await customerService.GetShopingDetails(_id);
            return res.status(200).json(data.cart);
        } catch (error) {
            next(error);
        }
    });
};
