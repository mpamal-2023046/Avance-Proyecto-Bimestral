import { checkUpdate } from '../../utils/encrypt.js'
import Category from './category.model.js'
import Product from '../products/products.model.js'
import User from '../user/user.model.js'



//Agregar categoria
export const addCategory = async (req, res) => {
    try {
        let data = req.body
        data.clasification = 'CATEGORY'    
        data.user = req.user.uid  
        const category = new Category(data)
        await category.save()
        return res.status(200).send({ message: 'Category added successfully' })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error creating the category.' })
    }
}



//Listar todo
export const getAllCategories = async (req,res )=>{
    try {
        const categories = await Category.find()
        return res.send(categories)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting the categories.'})
    }

}



//Actualizar categorias
export const updateCategory = async(req, res)=>{
    try {
        const data = req.body
        const { id} = req.params
        const update = checkUpdate(data, id)
        if(!update) return res.status(400).send(
            {
                message: 'Have submitted some data that cannot be updated or missing'
            }
        )
        const updatedCategory = await Category.updateOne(
            {_id: id},
            data,
            {new: true}
        )
        if (!updatedCategory) return res.status(404).send(
            {
                message: 'User not found' 
            }
        )
        return res.status(200).send({ message: 'Category updated successfully.' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating the information for the category.'})
    }
}



//Eliminar Categoria
 export const deleteCategory = async(req, res)=>{
    try {
        let {id} = req.params
        let category = await Category.findById(id)
        if (!category) return res.status(404).send({ message: 'Category not found' })
        if(category.clasification == 'DEFAULT') return res.status(401).send({message: 'You cannot delete the default category.'})
        let products = await Product.find()
        let categoryDefault = await Category.findOne({clasification: 'DEFAULT'})
        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            if (product.category == id){
                product.category = categoryDefault.id
                await product.save()
            }
        }
        await Category.deleteOne({ _id: id })
        return res.status(200).send({ message: 'Category deleted successfully.' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting the category.'})
    }
 }


 //Categoria por defecto (por si llega a elimnar una que este vinculada )
export const defaultCategory = async (nameCategory, descriptionCategory) => {
    try {
        const categoryFound = await Category.findOne({ clasification: 'CATEGORY' })
        const categoryDontFound = await Category.findOne({clasification: 'DEFAULT'})
        if (!categoryFound && !categoryDontFound) {
            const data = {
                name: nameCategory,
                description: descriptionCategory,
                clasification: 'DEFAULT'
            }
            const category = new Category(data) 
            await category.save()
            return console.log('Default category created :)')
        } else {
            return console.log(`Cannot create default category because it already exists`)
        }
    } catch (err) {
        console.error(err)
        
    }
}
defaultCategory('Default Category', 'This is a default category')