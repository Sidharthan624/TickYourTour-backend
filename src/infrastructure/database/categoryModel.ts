import mongoose, { Schema, Model } from 'mongoose'
import Category from '../../domain/category'

const categorySchema: Schema<Category> = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    isHidden: {
        type: Boolean,
        default: false
    }
})
const CategoryModel: Model<Category> = mongoose.model<Category>('category', categorySchema)
export { CategoryModel} 