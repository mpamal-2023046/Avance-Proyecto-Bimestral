import {Schema, model} from 'mongoose'

const productSchema = Schema(
    {
        name:{
            type: String,
            required: [true, 'Name is required'],
            maxLength: [35, `Can't be overcome 35 characters`]
        },
        description:{
            type: String,
            required: [true, 'Description is required'],
            maxLength: [50, `Can't be overcome 50 characters`]
        },
        brand:{
            type: String,
            required: [true, 'Brand is required'],
            maxLength: [30, `Can't be overcome 30 characters`]
        },
        price: {
            type: Number,
            required: [true, 'Price is required']
        },
        stock:{
            type: Number,
            required: [true, 'Stock is required'],
            min: 0
        },
        sold: {
            type: Number,
            required: [true, 'Sold is required'],
            default: 0
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required']
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model('Product', productSchema)