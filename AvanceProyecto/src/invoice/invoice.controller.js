import Invoice from './invoice.model.js';
import Product from '../products/products.model.js';




//Obtener todas las facturas
export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('customer').populate('products')
        return res.send({ success: true, invoices })
    } catch (err) {
        return res.status(500).send({ message: 'General error', err })
    }
}



//Obtener factuas por usuario
export const getInvoicesByCustomer = async (req, res) => {
    try {
        const { id } = req.params
        const invoices = await Invoice.find({ customer: id }).populate('products')
        if (invoices.length === 0) return res.status(404).send(
            {
                message: 'No invoices found for this customer' 
            }
        )
        return res.send({ success: true, invoices })
    } catch (err) {
        return res.status(500).send({ message: 'General error', err })
    }
}



// Obtener factura por id
export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params
        const invoice = await Invoice.findById(id).populate('customer').populate('products')
        if (!invoice) return res.status(404).send({ message: 'Invoice not found' })
        return res.send({ success: true, invoice })
    } catch (err) {
        return res.status(500).send({ message: 'General error', err })
    }
}



//Actualizar Factura
export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params
        let products = req.body.products
        let quantity = req.body.quantity
        if (typeof products === 'string') {
            products = products.split(',').map(p => p.trim())
        }
        if (typeof quantity === 'string') {
            quantity = quantity.split(',').map(q => Number(q.trim()))
        }
        if (!Array.isArray(products) || !Array.isArray(quantity)) {
            return res.status(400).send({ message: 'Products and quantities must be arrays' });
        }
        if (products.length !== quantity.length) {
            return res.status(400).send({ message: 'Mismatch between products and quantities' })
        }
        let total = 0
        const invoice = await Invoice.findById(id)
        if (!invoice) return res.status(404).send({ message: 'Invoice not found' })
        for (let i = 0; i < invoice.products.length; i++) {
            const product = await Product.findById(invoice.products[i])
            if (product) {
                product.stock += invoice.quantity[i]
                product.sold -= invoice.quantity[i]
                await product.save()
            }
        }
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i])
            if (!product) return res.status(404).send({ message: `Product not found: ${products[i]}` })
            if (product.stock < quantity[i]) {
                return res.status(400).send({ message: `Not enough stock for ${product.name}` })
            }
            total += product.price * quantity[i]
            product.stock -= quantity[i]
            product.sold += quantity[i]
            await product.save()
        }
        invoice.products = products
        invoice.quantity = quantity
        invoice.total = total
        invoice.price = total
        await invoice.save()
        return res.send({ success: true, message: 'Invoice updated', invoice })
    } catch (err) {
        return res.status(500).send({ message: 'General error', err })
    }
}