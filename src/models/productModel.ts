import mongoose, {Schema, Document} from "mongoose";

export interface IProduct extends Document {
    title: string;
    description: string;
    image: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

const productModel = mongoose.model<IProduct>("Product", ProductSchema);

export default productModel;