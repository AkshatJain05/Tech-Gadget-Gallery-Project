import mongoose from 'mongoose'


const productSchema =new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true
        },
        originalPrice:{
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        stockQuantity: {
            type: Number,
            default: 0
        },
        colorNumber:{
            type: Number,
            required: true
        },
        color:{
            type:[String],
            required: true
        },
        bestSeller:{
            type:Boolean,
            default:false,
        }


},
{timestamps:true}
)

export const Product = mongoose.model('Product', productSchema)