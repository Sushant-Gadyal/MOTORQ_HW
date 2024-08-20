const mongoose = require("mongoose");

const OrgSchema = mongoose.Schema({
    name : {
        type : String,
        required:true
    },
    account : {
        type : String,
        required : true,
    }
    ,
    website:{
        type : String,
        required:true,
    },
    fuelReimbursementPolicy:{
        type : String,
        defualt : "1000",
        required : true,
    }
    ,
    speedLimitPolicy : {
        type : String,
        required:true
    }

})

const OrgModel = mongoose.model("OrgModel",OrgSchema);

module.exports = OrgModel;