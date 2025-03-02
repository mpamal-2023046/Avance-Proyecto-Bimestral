import { Schema, model } from "mongoose"

const invoiceSchema = Schema(
    {
        date: {
            type: Date,
            default: Date.now
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        },
        NIT:{
            type: String,
            required: [true, 'NIT is required'],
            maxLength: [9, `Can't be overcome 9 characters`]
        },
        products: {
            type:[{
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required:true
            }]
        },
        quantity: {
            type: [{
                type: Number,
                required: true
            }]
        },
        price: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        typeOfPayment: {
            type: String,
            required: true,
            uppercase: true,
            enum: ['CARD', 'CASH']
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)


export default model('Invoice', invoiceSchema)