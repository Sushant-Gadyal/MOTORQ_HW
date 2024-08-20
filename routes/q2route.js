const express = require("express");
const axios = require('axios');
const q2router = express();
const VehicleModel = require("../model/VehicleModel");
const OrgModel = require("../model/OrgModel.js");

q2router.post("/",async function(req,res){
    // Validate the VIN (ensure it's a 17 character alphanumeric string)
    const {vin,org} = req.body;

    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return res.status(400).json({ error: "Invalid VIN format" });
    }

    const Orgpresent = await OrgModel.findOne({name:org});

    if(!Orgpresent){
        return res.status(400).json({error:"The organization given is not present"});
    }   

    // Fetch data from NHTSA
    const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);

    // Extract relevant vehicle details
    
    const manufacturer= response.data.Results.find(result => result.Variable === "Make").Value;
    const model=  response.data.Results.find(result => result.Variable === "Model").Value;
    const year= response.data.Results.find(result => result.Variable === "Model Year").Value;
    

    const Vehdetails = await VehicleModel.create({
        vin : req.body.vin,
        org : req.body.org,
        manufacturer : manufacturer,
        model : model,
        year : year,
    })

    res.status(201).json(Vehdetails);
    
})


module.exports = q2router