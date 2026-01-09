import { Types } from "mongoose";
import { cartModel, ICartItem } from "../models/cartModel";
import { IOrderItem, orderModel } from "../models/orderModel";
import productModel from "../models/productModel";
import { AppError } from "../middlewares/errorHandler";

interface CreateCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId });
  await cart.save();
  return cart;
};

interface GetActiveCartForUser {
  userId: string;
  populateProduct?: boolean;
}

export const getActiveCartForUser = async ({
  userId,
  populateProduct,
}: GetActiveCartForUser) => {
  let cart;

  if (populateProduct) {
    cart = await cartModel
      .findOne({ userId, status: "active" })
      .populate("items.product");
  } else {
    cart = await cartModel.findOne({ userId, status: "active" });
  }

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return { data: cart, statusCode: 200 };
};

interface AddItemToCart {
  userId: string;
  productId: any;
  quantity: number;
}

export const addItemToCart = async ({
  userId,
  productId,
  quantity,
}: AddItemToCart) => {
  const response = await getActiveCartForUser({ userId });
  const cart = response.data;
  const existInCart = await cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existInCart) {
    throw new AppError("Item already in cart", 400);
  }

  const product = await productModel.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 400);
  }

  if (product.stock < quantity) {
    throw new AppError("Insufficient stock", 400);
  }

  cart.items.push({
    product: productId,
    unitPrice: product.price,
    quantity,
  });

  cart.totalAmount += product.price * quantity;

  await cart.save();

  return {
    data: (await getActiveCartForUser({ userId, populateProduct: true })).data,
    statusCode: 200,
  };
};

interface UpdateItemInCart {
  userId: string;
  productId: any;
  quantity: number;
}
export const updateItemInCart = async ({
  userId,
  productId,
  quantity,
}: UpdateItemInCart) => {
  const response = await getActiveCartForUser({ userId });
  const cart = response.data;
  const existInCart = await cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!existInCart) {
    throw new AppError("Item not found in cart", 400);
  }

  const product = await productModel.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 400);
  }

  if (product.stock < quantity) {
    throw new AppError("Insufficient stock", 400);
  }

  const otherCartItems = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  let total = calculateCartTotalItems(otherCartItems);

  existInCart.quantity = quantity;
  total += existInCart.unitPrice * existInCart.quantity;
  cart.totalAmount = total;

  await cart.save();
  return {
    data: (await getActiveCartForUser({ userId, populateProduct: true })).data,
    statusCode: 200,
  };
};

interface DeleteItemInCart {
  userId: string;
  productId: any;
}

export const deleteItemInCart = async ({
  userId,
  productId,
}: DeleteItemInCart) => {
  const response = await getActiveCartForUser({ userId });
  const cart = response.data;
  const existInCart = await cart.items.find(
    (item) => item.product.toString() === productId
  );
  console.log(cart);

  if (!existInCart) {
    throw new AppError("Item not found in cart", 400);
  }

  const otherCartItems = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  let total = calculateCartTotalItems(otherCartItems);

  cart.items = otherCartItems;
  cart.totalAmount = total;

  await cart.save();
  return {
    data: (await getActiveCartForUser({ userId, populateProduct: true })).data,
    statusCode: 200,
  };
};

const calculateCartTotalItems = (cartItems: ICartItem[]) => {
  let total = cartItems.reduce((sum, item) => {
    return (sum += item.unitPrice * item.quantity);
  }, 0);

  return total;
};

interface ClearCart {
  userId: string;
}

export const clearCart = async ({ userId }: ClearCart) => {
  const response = await getActiveCartForUser({ userId });
  const cart = response.data;
  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();
  return {
    data: (await getActiveCartForUser({ userId, populateProduct: true })).data,
    statusCode: 200,
  };
};

interface CheckOut {
  userId: string;
  address: string;
}

export const checkout = async ({ userId, address }: CheckOut) => {
  if (!address) throw new AppError("Please add the address", 400);

  const response = await getActiveCartForUser({ userId });
  const cart = response.data;

  const orderItems: IOrderItem[] = [];

  const productIds: Types.ObjectId[] = cart.items.map((item) => {
    const pid = (item.product as any)._id ?? item.product;
    return new Types.ObjectId(pid);
  });

  const products = await productModel.find({ _id: { $in: productIds } });

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  cart.items.forEach((item) => {
    const product = productMap.get(item.product._id.toString());

    if (!product) {
      throw new AppError("Product not found", 400);
    }

    const orderItem: IOrderItem = {
      ProductTitle: product.title,
      ProductImage: product.image,
      Quantity: item.quantity,
      UnitProce: item.unitPrice,
    };

    orderItems.push(orderItem);
  });

  const order = await orderModel.create({
    orderItems,
    total: cart.totalAmount,
    address,
    userId,
  });

  await order.save();

  cart.status = "completed";
  await cart.save();

  return { data: order, statusCode: 200 };
};
