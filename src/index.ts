import { createServer } from './infrastructure/config/app'; 
import { connectDB } from './infrastructure/config/connectDB';
import dotenv from 'dotenv'

dotenv.config()

const startServer = async () => {
    try {
        const PORT = process.env.PORT || 5000
        const app = createServer()
        app?.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            
        })
        await connectDB()
    } catch (error) {
        console.log(error);
        
    }
}

startServer()
