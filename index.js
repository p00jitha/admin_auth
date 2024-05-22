import express from 'express';
import dotenv from 'dotenv';
import connectdatabase from './db/connect_db.js'
import authRoutes from './routes/auth_routes.js'
const app = express()
dotenv.config()
app.use(express.json())

app.use("/api/auth", authRoutes);

app.get('/',(req,res)=>{
    res.send('hello')
})

connectdatabase();

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log('server is running');
})