const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
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


const addFirm = async(req,res)=>{
    try{
        const {firmName,area,category,region,offer} = req.body;
        const image = req.file? req.file.filename: undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if(!vendor){
            return res.status(404).json({message:"Vendor Not Found"});
        }

        const firm = new Firm({
            firmName,area,category,region,offer,image,vendor : vendor._id 
        })
        
        const savedfirm = await firm.save();
        vendor.firm.push(savedfirm);

        await vendor.save();

        return res.status(200).json({message:"Firm added Successfully"})

    }catch(error){
        console.error(error);
        res.status(500).json("Internal Server Error");  
    }
}   

const deleteFirmById = async (req,res)=>{
    try{
        const firmId = req.params.firmId;
        const deletedfirm = await Firm.findByIdAndDelete(firmId);

        if(!deletedfirm){
            return res.status(404).json({error:"No Firm Found to Delete"})
        }
    }catch(error){
        console.error(error);
        res.status(500).json("Internal Server Error");  
    }
}
//syntax of exporting when we have images also
module.exports = {addFirm: [upload.single('image'), addFirm] , deleteFirmById};