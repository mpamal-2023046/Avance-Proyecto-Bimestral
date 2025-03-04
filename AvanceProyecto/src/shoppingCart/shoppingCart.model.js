import {model, Schema} from 'mongoose'

const shoppingCartSchema = Schema ({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Customer is required']
    },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1}
    }],
    total: {
        type: Number,
        default: 0
    }
})


export default model ('shoppingCart', shoppingCartSchema)