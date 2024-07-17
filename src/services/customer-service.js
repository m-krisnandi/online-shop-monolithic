const { CustomerRepository } = require("../database");
const {
    FormateData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword,
} = require("../utils");
const { APIError } = require("../utils/app-errors");

class CustomerService {
    constructor() {
        this.repository = new CustomerRepository();
    }

    async SignIn(userInputs) {
        const { email, password } = userInputs;

        try {
            const existingCustomer = await this.repository.FindCustomer({
                email,
            });

            if (existingCustomer) {
                const validPassword = await ValidatePassword(
                    password,
                    existingCustomer.password,
                    existingCustomer.salt
                );

                if (validPassword) {
                    const token = await GenerateSignature({
                        email: existingCustomer.email,
                        _id: existingCustomer._id,
                    });
                    return FormateData({ id: existingCustomer._id, token });
                }
            }

            return FormateData(null);
        } catch (error) {
            throw new APIError("Data not found", error);
        }
    }

    async SignUp(userInputs) {
        const { email, password, phone } = userInputs;

        try {
            let salt = await GenerateSalt();

            let userPassword = await GeneratePassword(password, salt);

            const existingCustomer = await this.repository.CreateCustomer({
                email,
                password: userPassword,
                phone,
                salt,
            });

            const token = await GenerateSignature({
                email: email,
                _id: existingCustomer._id,
            });

            return FormateData({ id: existingCustomer._id, token });
        } catch (error) {
            throw new APIError("Data Not found", error);
        }
    }

    async AddNewAddress(_id, userInputs) {
        const { street, postalCode, city, country } = userInputs;

        try {
            const addressResult = await this.repository.CreateAddress({
                _id,
                street,
                postalCode,
                city,
                country,
            });
            return FormateData(addressResult);
        } catch (error) {
            throw new APIError("Data Not found", error);
        }
    }

    async GetProfile(id) {
        try {
            const existingCustomer = await this.repository.FindCustomerById({id});
            return FormateData(existingCustomer);
        } catch (error) {
            throw new APIError('Data Not found', error)
        }
    }

    async GetShopingDetails(id) {
        try {
            const existingCustomer = await this.repository.FindCustomerById({id});

            if (existingCustomer) {
                return FormateData(existingCustomer);
            }
            return FormateData({msg: 'Error'})
        } catch (error) {
            throw new APIError('Data Not found', error);
        }
    }

    async GetWishList(customerId) {
        try {
            const wishListItems = await this.repository.Wishlist(customerId);
            return FormateData(wishListItems);
        } catch (error) {
            throw new APIError('Data Not found', error);
        }
    }

    async AddToWishlist(customerId, product) {
        try {
            const wishlistResult = await this.repository.AddWishlistItem(customerId, product);
            return FormateData(wishlistResult);
        } catch (error) {
            throw new APIError('Data Not found', error);
        }
    }
}

module.exports = CustomerService;