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
            required: [true, 'Stock is required']
        },
        /*soldOut:{
            type: Schema.Types.ObjectId,
            //ref: ,
            required: [true, 'SoldOut is required']
        },
        sold: {
            type: Schema.Types.ObjectId,
            //ref: ,
            required: [true, 'Sold is required']
        },*/
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

export default model('product', productSchema)