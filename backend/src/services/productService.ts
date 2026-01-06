import { AppError } from "../middlewares/errorHandler";
import productModel from "../models/productModel";

export const getAllProducts = async () => {
  try {
    var products = await productModel.find();
    return { data: products, statusCode: 200 };
  } catch (error) {
    return { data: `Internal Server Error: ${error}`, statusCode: 500 };
  }
};

export const getProductById = async (productId: string | undefined) => {
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

export const updateProduct = async (
  productId: string | undefined,
  productData: any
) => {
  var product = await productModel.findByIdAndUpdate(productId, productData, {
    new: true,
  });

  if (!product) {
    return { data: "Product not found", statusCode: 404 };
  }

  return { data: product, statusCode: 200 };
};

export const deleteProduct = async (productId: string | undefined) => {
  var product = await productModel.findByIdAndDelete(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return { data: "Product deleted successfully", statusCode: 200 };
};

export const seedInitialProducts = async () => {
  const products = [
    {
      title: "LENOVO Laptop",
      description: "Ideapad Slim 3 Intel Core i5-13420H 8GB 512SSD 15.3 WUXGA FreeDOS Dizüstü Bilgisayar 83K1004ETR",
      image: "https://cdn-img.pttavm.com/pimages/592/138/142/52e9c884-9653-4178-8362-4e344bb291c6.webp?v=202402141157",
      price: 20999,
      stock: 8,
    },
        {
      title: "HP Laptop",
      description: "Victus Intel Core i5-14450HX 16GB 1TB SSD RTX4050 120W 16.1 Freedos FHD 144Hz Gaming Laptop BL6W5EA",
      image: "https://m.media-amazon.com/images/I/71hPcioT75L._AC_UF1000,1000_QL80_.jpg",
      price: 42349,
      stock: 18,
    },
        {
      title: "ACER Laptop",
      description: "Aspire Go AG15-71P Intel Core i7-13620H 16GB 512GB SSD 15.6 FHD Freedos Bilgisayar NX.J6SEY.001",
      image: "https://productimages.hepsiburada.net/s/777/375/110001258429113.jpg/format:webp",
      price: 25999,
      stock: 5,
    },
        {
      title: "DELL Laptop",
      description: "Pro 15 Essential 13.Nesil Core i5 1334U-16Gb-512Gb Ssd-15.6inc-W11",
      image: "https://www.links.hr/images/thumbs/0260997_laptop-dell-pro-15-essential-core-i5-1334u-16gb-1tb-ssd-intel-iris-xe-graphics-156-fhd-ips-windows-_550.jpg",
      price: 26970,
      stock: 10,
    },
  ];

  var existingProducts = await productModel.find();
  if (existingProducts.length == 0) {
    await productModel.insertMany(products);
  }
};
