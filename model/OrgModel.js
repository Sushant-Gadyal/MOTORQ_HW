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
    ,
    parent:{
        type : String ,
        default : "null",
    },
    child:{
        type : [String],
        default : [],
    },
    level:{
        type : Number,
        default : 0,
    },
    // overidden : {
    //     type : Boolean,
    //     default : false,
    // }


})

const OrgModel = mongoose.model("OrgModel",OrgSchema);

module.exports = OrgModel;