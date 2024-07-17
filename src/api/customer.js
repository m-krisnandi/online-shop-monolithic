const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
    const service = new CustomerService();

    app.post("/customer/signup", async (req, res, next) => {
        try {
            const { email, password, phone } = req.body;
            const { data } = await service.SignUp({ email, password, phone });
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.post("/customer/login", async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const { data } = await service.SignIn({ email, password });

            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.post("/customer/address", UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;

            const { street, postalCode, city, country } = req.body;

            const { data } = await service.AddNewAddress(_id, {
                street,
                postalCode,
                city,
                country,
            });

            return res.status(201).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get("/customer/profile", UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetProfile({ _id });
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get("/customer/wishlist", UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetWishList(_id);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    });
};
