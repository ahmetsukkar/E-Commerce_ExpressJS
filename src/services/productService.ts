import productModel from "../models/productModel";

export const getAllProducts = async () => {
    try {
        var products = await productModel.find();
        return { data: products, statusCode: 200 };
    } catch (error) {
        return { data: `Internal Server Error: ${error}`, statusCode: 500 };
    }
};

export const getProductById = async (productId: string) => {
    try {
        var product = await productModel.findById(productId);

        if (!product) {
            return { data: "Product not found", statusCode: 404 };
        }
        return { data: product, statusCode: 200 };
    } catch (error) {
        return { data: `Internal Server Error: ${error}`, statusCode: 500 };
    }
};

interface CreateProductParams {
    title: string;
    description?: string;
    image: string;
    price: number;
    stock: number;
}

export const createProduct = async ({
    title,
    description,
    image,
    price,
    stock,
}: CreateProductParams) => {
    try {
        const product = new productModel({
            title,
            description,
            image,
            price,
            stock,
        });
        await product.save();
        return { data: product, statusCode: 201 };
    } catch (error) {
        return { data: `Internal Server Error: ${error}`, statusCode: 500 };
    }
};

export const updateProduct = async (productId: string, productData: any) => {
    try {
        var product = await productModel.findByIdAndUpdate(productId, productData, {
            new: true,
        });

        if (!product) {
            return { data: "Product not found", statusCode: 404 };
        }

        return { data: product, statusCode: 200 };
    } catch (error) {
        return { data: `Internal Server Error: ${error}`, statusCode: 500 };
    }
};

export const deleteProduct = async (productId: string) => {
    try {
        var product = await productModel.findByIdAndDelete(productId);

        if (!product) {
            return { data: "Product not found", statusCode: 404 };
        }

        return { data: "Product deleted successfully", statusCode: 200 };
    } catch (error) {
        return { data: `Internal Server Error: ${error}`, statusCode: 500 };
    }
};

export const seedInitialProducts = async () => {
    const products = [
        {
            title: "Sample Product 1",
            description: "This is a sample product",
            image: "https://via.placeholder.com/150",
            price: 19.99,
            stock: 100,
        },
    ];

    var existingProducts = await productModel.find();
    if (existingProducts.length == 0) {
        await productModel.insertMany(products);
    }
};
