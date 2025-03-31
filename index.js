const express = require("express");
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const bodyParser = require('body-parser');
const path = require('path')
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = 4000;

mongoose.connect(process.env.URI)
    .then(()=>console.log("MongoDB connected successfully"))
    .catch((error)=>console.log(error))

app.use(bodyParser.json());

app.use('/vendor',vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads',express.static('uploads'));

// Starting Server
app.listen(PORT,()=>{
    console.log(`Server started and is running on PORT ${PORT}`);
})

//route
app.use('/home', (req,res)=>{
    res.send("<h1> Welcome to Home page </h1>");
})
