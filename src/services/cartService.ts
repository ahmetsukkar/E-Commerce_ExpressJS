import { cartModel } from "../models/cartModel";
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

  let total = otherCartItems.reduce((sum, item) => {
    return (sum += item.unitPrice * item.quantity);
  }, 0);

  existInCart.quantity = quantity;
  total += existInCart.unitPrice * existInCart.quantity;
  cart.totalAmount = total;

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};
