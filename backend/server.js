import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js";
import {errorHandler, notFound} from "./middleware/errorMiddleware.js";
import {connectDB} from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config()
const port = process.env.PORT || 5100

connectDB()
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
	res.send('Server is work')
})

app.use(errorHandler)
app.use(notFound)

app.listen(port, () => {
	console.log(`Server start on port ${port}`)
})

