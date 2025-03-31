    const Vendor = require('../models/Vendor');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    const dotenv = require('dotenv');
    dotenv.config();

    const secretKey = process.env.WhatisYourName;

    const vendorRegister = async(req,res)=>{
        const {username, email, password} = req.body;

        try{
            const vendorEmail = await Vendor.findOne({email});
            if(vendorEmail){
                return res.status(400).json("Email already used"); 
            }
            const hashedPassword = await bcrypt.hash(password,12);

            // creating instance(i.e record) of Vendor Model
            const newVendor = new Vendor({
                username,
                email,
                password: hashedPassword
            });
            await newVendor.save();

            res.status(201).json({message:"Vendor registered successfully"});
            console.log("Vendor registered successfully");

        }catch(error){
            console.error(error);
            res.status(500).json({error:"Internal Server Error"});
        }
    }   



    const vendorLogin = async(req,res)=>{
        const {email,password}=req.body;

        try{
            const vendor = await Vendor.findOne({email});
            if(!vendor || !(await bcrypt.compare(password,vendor.password))){
                return res.status(401).json({error:"Invalid email or Password"});
            }
            const token = jwt.sign({vendorId : vendor._id}, secretKey, {expiresIn : "1h"});
            res.status(200).json({sucess:"Login Successful" , token});
            console.log(email , "Token -" , token);

        }catch(error){
            console.error(error);
            res.status(500).json({error:"Internal Server Error"});
        }
    }


    const getAllVendors = async(req,res)=>{
        try{
            const vendors = await Vendor.find().populate('firm');
            res.json({vendors});
        }catch(error){
            console.error(error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }

    const getVendorById = async(req,res)=>{
        const vendorid = req.params.id;
        try{
            const vendor = await Vendor.findById(vendorid).populate('firm');
            if(!vendor){
                return res.status(404).json({error:"Vendor not Found"});
            }
            res.status(201).json({vendor});
        }catch(error){
            console.error(error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }

    module.exports = {vendorRegister , vendorLogin , getAllVendors , getVendorById };