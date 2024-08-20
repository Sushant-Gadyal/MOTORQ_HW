const express = require("express");
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const q1router = express();

let vinCache = {};

// Set up rate limiting: 5 requests per minute
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    message: "Too many requests, please try again later."
});

q1router.use(limiter);// Apply rate limiting to all routes



q1router.get("/decode/:vin",async function(req,res){
    const {vin} = req.params;

    // Validate the VIN (ensure it's a 17 character alphanumeric string)
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return res.status(400).json({ error: "Invalid VIN format" });
    }

     // Check cache first -> for avoiding repeated calls
     if (vinCache[vin]) {
        return res.json(vinCache[vin]);
    }

    try {
        // Fetch data from NHTSA
        const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);

        // Extract relevant vehicle details
        const vehicleDetails = {
            manufacturer: response.data.Results.find(result => result.Variable === "Make").Value,
            model: response.data.Results.find(result => result.Variable === "Model").Value,
            year: response.data.Results.find(result => result.Variable === "Model Year").Value,
        };

        // Store in cache for future requests
        vinCache[vin] = vehicleDetails;

        // Respond with the vehicle details
        res.json(vehicleDetails);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data from NHTSA API" });
    }
})

module.exports = q1router