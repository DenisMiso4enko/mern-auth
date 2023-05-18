import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI)
		console.log(`Mongo connected: ${conn.connection.host}`)
	} catch (e) {
		console.log(e.message)
		process.exit(1)
	}
}