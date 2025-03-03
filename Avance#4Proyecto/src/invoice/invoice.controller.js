import Invoice from './invoice.model.js';
import Product from '../products/products.model.js';



//Crear Factura (validando stock)
export const addInvoice = async (req, res) => {
    try {
        const { customer, NIT, products, quantity, typeOfPayment } = req.body
        if (products.length !== quantity.length) {
            return res.status(400).send({ message: 'Mismatch between products and quantities' })
        }
        let total = 0;
        let productDetails = []
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i]);
            if (!product) return res.status(404).send({ message: `Product not found: ${products[i]}` })
            if (product.stock < quantity[i]) {
                return res.status(400).send({ message: `Not enough stock for ${product.name}` })
            }
            total += product.price * quantity[i]
            product.stock -= quantity[i]
            product.sold += quantity[i]
            await product.save()
            productDetails.push(product)
        }
        const invoice = new Invoice(
            { 
                customer, NIT, 
                products, quantity, 
                price: total, total, 
                typeOfPayment 
            }
        )
        await invoice.save()
        return res.send({ success: true, message: 'Invoice created', invoice })
    } catch (err) {
        return res.status(500).send({ message: 'General error', err })
    }
}



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
        const { customerId } = req.params
        const invoices = await Invoice.find({ customer: customerId }).populate('products')
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
        const { products, quantity } = req.body
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



//Eliminar Factura
export const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params
        const invoice = await Invoice.findByIdAndDelete(id)
        if (!invoice) return res.status(404).send({ message: 'Invoice not found' })
        return res.send({ success: true, message: 'Invoice deleted' })
    } catch (err) {
        return res.status(500).send({ message: 'General error', err })
    }
}