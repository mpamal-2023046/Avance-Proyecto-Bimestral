import {model, Schema} from 'mongoose'

const shoppingCartSchema = Schema ({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Customer is required']
    },
    products: {
        type:[{
            type: Schema.Types.ObjectId,
            ref: 'product',
            required:[true, 'Products is required']
        }]
    },
    quantity: {
        type: [{
            type: Number,
            required: true
        }]
    },
    total: {
        type: Number,
        required: true,
        required: [true, 'Total is required']
    }
})


export default model ('shoppingCart', shoppingCartSchema)