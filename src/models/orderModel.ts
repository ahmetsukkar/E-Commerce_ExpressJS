import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IOrderItem {
  ProductTitle: string;
  ProductImage:string;
  UnitProce: number;
  Quantity: Number;
}

export interface IOrder extends Document{
    orderItems: IOrderItem[],
    total: number
    address: string
    userId: ObjectId | string
}

const OrderItemSchema = new Schema<IOrderItem>({
    ProductTitle : {type: String, required:true},
    ProductImage : {type: String, required:true},
    UnitProce : {type: Number, required:true},
    Quantity : {type: Number, required:true},
});

const OrderSchema = new Schema<IOrder>({
    orderItems: [OrderItemSchema],
    total : {type: Number, required: true},
    address: {type: String, required : true},
    userId: { type: Schema.Types.ObjectId, ref:"User" , required: true },
})


export const orderModel = mongoose.model<IOrder>("Order", OrderSchema);
