const express = require("express");
const OrgModel = require("../model/OrgModel");

const q4router = express();

q4router.post("/", async function(req,res){

        // Validate required fields
    if (!req.body.name || !req.body.account || !req.body.website || !req.body.speedLimitPolicy) {
            return res.status(400).json({ error: "Invlaid Input" });
    }


    const newOrg = await OrgModel.create({
            name : req.body.name,
            account : req.body.account,
            website : req.body.website,
            fuelReimbursementPolicy : req.body.fuelReimbursementPolicy || "1000",
            speedLimitPolicy : req.body.speedLimitPolicy,
            parent : req.body.parent,
    });

    if(req.body.parent){
        const parentnode = await OrgModel.findOne({name : req.body.parent});
        if(parentnode){
            parentnode.child.push(newOrg.name);
            newOrg.level = parentnode.level + 1;
            
            await parentnode.save();
            await newOrg.save();
        }
    }
    
    res.status(201).json({newOrg});
    

});

module.exports = q4router;