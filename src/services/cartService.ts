import { Types } from "mongoose";
import { cartModel, ICartItem } from "../models/cartModel";
import { IOrderItem, orderModel } from "../models/orderModel";
import productModel from "../models/productModel";

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
}

export const getActiveCartForUser = async ({
  userId,
}: GetActiveCartForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
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
  const cart = await getActiveCartForUser({ userId });
  const existInCart = await cart.items.find(
    (item) => item.product.toString() === productId
  );
  console.log("cart:", cart);
  console.log("Exist in cart:", existInCart);

  if (existInCart) {
    return { data: "Item already in cart", statusCode: 400 };
  }

  const product = await productModel.findById(productId);
  if (!product) {
    return { data: "Product not found", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "Insufficient stock", statusCode: 400 };
  }

  cart.items.push({
    product: productId,
    unitPrice: product.price,
    quantity,
  });

  cart.totalAmount += product.price * quantity;

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
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
  const cart = await getActiveCartForUser({ userId });
  const existInCart = await cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!existInCart) {
    return { data: "Item not found in cart", statusCode: 400 };
  }

  const product = await productModel.findById(productId);
  if (!product) {
    return { data: "Product not found", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "Insufficient stock", statusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  let total = calculateCartTotalItems(otherCartItems);

  existInCart.quantity = quantity;
  total += existInCart.unitPrice * existInCart.quantity;
  cart.totalAmount = total;

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};

interface DeleteItemInCart {
  userId: string;
  productId: any;
}

export const deleteItemInCart = async ({
  userId,
  productId,
}: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });
  const existInCart = await cart.items.find(
    (item) => item.product.toString() === productId
  );
  console.log(cart);

  if (!existInCart) {
    return { data: "Item not found in cart", statusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  let total = calculateCartTotalItems(otherCartItems);

  cart.items = otherCartItems;
  cart.totalAmount = total;

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
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
  const cart = await getActiveCartForUser({ userId });
  cart.items = [];
  cart.totalAmount = 0;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};

interface CheckOut {
  userId: string;
  address: string;
}

export const checkout = async ({ userId, address }: CheckOut) => {
  if (!address) return { data: "Please add the address", statusCode: 400 };

  const cart = await getActiveCartForUser({ userId });

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
      return { data: "Product not found", statusCode: 400 };
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
