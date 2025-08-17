import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: { type:mongoose.Schema.Types.ObjectId ,ref:'Product',
    required: true },
    quantity: { type: Number, required: true, min: 1 }
}
)

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        cartItem:{
            type:[cartItemSchema],
            default: []
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    {timestamps:true}
)

export const User = mongoose.model('User', userSchema);