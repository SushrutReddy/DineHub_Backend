const Product = require('../models/Product');
const Firm = require('../models/Firm');
const multer = require('multer');


// Configure storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Set the destination folder for uploads
    },
    filename: (req, file, cb) => {
        // Set a unique filename for each uploaded file (e.g., original name + timestamp)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage}); 

const addProduct = async(req,res)=>{
    try{
        const {productName,price,category,bestseller,description} = req.body;
        const image = req.file? req.file.filename: undefined;

        const firmId = req.params.firmid;
        const firm = await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({message : "No Firm with the id is found"});
        }

        const product = new Product({
            productName,price,category,bestseller,description,image, firm : firm._id
        })

        const savedProduct = await product.save();
        firm.products.push(savedProduct);

        await firm.save();

        res.status(200).json({savedProduct})

    }catch(error){
        console.error(error);
        res.status(500).json("Internal Server Error");  
    }
}

// Getting entire product details in a firm rather than just getting their ObjectIds
const getProductByFirm = async(req,res)=>{
    try{
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error:"No Firm Found"});
        }

        const restaurantName = firm.firmName;
        const products = await Product.find({firm : firmId});
        res.status(200).json({restaurantName,products});

    }catch(error){
        console.error(error);
        res.status(500).json("Internal Server Error");      
    }
}

const deleteProductById = async (req,res)=>{
    try{
        const productId =  req.params.productId;
        const deletedproduct = await Product.findByIdAndDelete(productId);

        if(!deletedproduct){
            return res.status(404).json({error : "No Product Found"});

        }

    }catch(error){
        console.error(error);
        res.status(500).json("Internal Server Error");   
    }
}
module.exports = {addProduct:[upload.single('image'),addProduct] , getProductByFirm , deleteProductById}; 