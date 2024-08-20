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


app.use("/vehicles/decode",q1router);  // q1 in this

// q3 
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

app.use("/vehicles",q2router); // q2  both in this
app.use("/Orgs",q4router);

app.patch("/org",async function(req,res){

    // for current node
    const updatedOrg = await OrgModel.findOne({name:req.body.name})
    updatedOrg.fuelReimbursementPolicy = req.body.fuelReimbursementPolicy;
    updatedOrg.speedLimitPolicy = req.body.speedLimitPolicy;
    await updatedOrg.save();

    // now handling child nodes
    let ansarr = [];
    ansarr.push(updatedOrg);

    let childarr = [];
    for(let i = 0; i<updatedOrg.child.length ; i++){
        const childOrgName = updatedOrg.child[i];
        childarr.push(childOrgName);
    }

    console.log(childarr);

    while(childarr.length>0){
        const childOrgName = childarr[0];
        const childOrg = await OrgModel.findOne({name:childOrgName});
        const parentOrg = await OrgModel.findOne({name:childOrg.parent});

        ansarr.push(childOrg);

        childOrg.fuelReimbursementPolicy = parentOrg.fuelReimbursementPolicy;
        childOrg.speedLimitPolicy = parentOrg.speedLimitPolicy;

        await childOrg.save();

        for(let i=0 ; i<childOrg.child.length;i++){
            childarr.push(childOrg.child[i]);
        }
        childarr.shift();
    }

    res.status(200).json({ansarr});

})

app.get("/orgs",async function(req,res){
    const allorgs = await OrgModel.find({});

    let mx = 0;
    allorgs.forEach(org=>{
        if(org.level>mx){
            mx = org.level;
        }
    })

    let curr_lev = 0;
    let ans_arr = []
    for(let i=0 ; i<=mx ; i++){
        let lev_arr=[];
        allorgs.forEach(org=>{
            if(org.level==curr_lev) lev_arr.push(org);
        })
        ans_arr.push(lev_arr);
    }
    res.status(200).json({ans_arr});
})

app.get("/", function(req,res){
    res.send("running");
})

app.listen(port,function(){
    console.log("Ser running on port 5000");
})