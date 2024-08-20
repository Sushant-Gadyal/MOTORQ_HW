const express = require("express");
const bodyParser = require("body-parser");
const q1router = require("./routes/q1route.js");
const connectDb = require("./config/db.js");
const q2router = require("./routes/q2route.js");
const q4router = require("./routes/q4route.js");
const app = express();

const VehicleModel = require("./model/VehicleModel.js");
const OrgModel = require("./model/OrgModel.js");

const port  = 5000

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//db connection
connectDb();

app.get("/vehicles/:vin",async function(req,res){
    const gotvin = req.params.vin;

    // Validate the VIN (ensure it's a 17 character alphanumeric string)
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(gotvin)) {
        return res.status(400).json({ error: "Invalid VIN format" });
    }

    const vehdet = await VehicleModel.findOne({
        vin : gotvin,
    })

    if(!vehdet){
        res.status(404).json({error:"Vehicle does not exist"});
    }

    res.status(200).json({vehdet});
})

app.use("/vehicles/decode",q1router);  // q1 in this
app.use("/vehicles",q2router); // q2  both in this
app.use("/Orgs",q4router);

app.get("/", function(req,res){
    res.send("running");
})

app.listen(port,function(){
    console.log("Ser running on port 5000");
})