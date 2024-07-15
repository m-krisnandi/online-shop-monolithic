const ProductService = require("../services/product-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
    const service = new ProductService();

    app.post("/product/create", async (req, res, next) => {
        try {
            const {
                name,
                desc,
                type,
                unit,
                price,
                available,
                suplier,
                banner,
            } = req.body;
            const { data } = await service.CreateProduct({
                name,
                desc,
                type,
                unit,
                price,
                available,
                suplier,
                banner,
            });
            return res.status(201).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get("/", async (req, res, next) => {
        try {
            const { data } = await service.GetProducts();
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get("/category/:type", async (req, res, next) => {
        const type = req.params.type;

        try {
            const { data } = await service.GetProductByCategory(type);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get("/:id", async (req, res, next) => {
        const productId = req.params.id;

        try {
            const { data } = await service.GetProductDescription(productId);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.post("/ids", async (req, res, next) => {
        try {
            const { ids } = req.body;
            const products = await service.GetSelectedProducts(ids);
            return res.status(200).json(products);
        } catch (error) {
            next(err);
        }
    });

    // app.put("wishlist", UserAuth, async (req, res, next) => {
    //     const { _id } = req.user;
    //     try {
    //         const product = await service.GetProductById(req.body._id);
    //         const wishList = await customerService.AddToWishlist(_id, product);
    //         return res.status(200).json(wishList);
    //     } catch (error) {
    //         next(error);
    //     }
    // });

};
