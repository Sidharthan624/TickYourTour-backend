import mongoose, { Schema, Model } from 'mongoose'
import User from '../../domain/user'

const userSchema:Schema<User> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    phone: {
        type:Number,
        
    },
    image: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type:Date,
        default:Date.now
    }


})
const UserModel: Model<User> = mongoose.model<User>('user', userSchema)
export { UserModel }