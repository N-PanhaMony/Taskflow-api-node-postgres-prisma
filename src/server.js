import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5001

//Get file path from URL of thr current module 
const __filename = fileURLToPath(import.meta.url)
//Get directory name from the file path
const __dirname = dirname(__filename)

//Middleware
app.use(express.json())
//tell express to provides all files from public folder as static file
app.use(express.static(path.join(__dirname , '../public')))

//Provides HTML file from the public directory
app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//Routes
app.use('/auth',authRoutes)
app.use('/todos',authMiddleware,todoRoutes)

app.listen(PORT , ()=>{
    console.log(`server run on port :${PORT}`);
})
