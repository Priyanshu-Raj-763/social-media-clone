import mongoose from "mongoose";

const DbConnnect = async () => {
    try {
        const connection = mongoose.connect(process.env.MONGO_URI)
        console.log("MONGO_DB Connected Successfully ✅")
    } catch (error) {
        console.log("Failed to Connect with MONGO ❌",error);
        process.exit(1)
    }
}

export default DbConnnect;