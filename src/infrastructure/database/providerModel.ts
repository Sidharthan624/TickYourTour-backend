import mongoose,{ Schema, Model} from "mongoose";
import Provider from "../../domain/provider";

const providerSchema: Schema<Provider> = new Schema({
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
   image: {
    type: String,
   },
   isBlocked: {
    type: Boolean,
    default: false
   },
   phone: {
    type: String 
   },
   creationTime: {
    type: Date,
    default: Date.now
   },
   subscriptionId: {
      type: String
  },
  isVerified: {
      type: Boolean,
      default: false
  }
})
const ProviderModel: Model<Provider> = mongoose.model<Provider>('provider', providerSchema)
export {ProviderModel}