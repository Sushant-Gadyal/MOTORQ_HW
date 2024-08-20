const mongoose = require("mongoose");

const VehicleSchema = mongoose.Schema({
    vin:{
        type : String,
        required:true,
    },
    org : {
        type : String,
        required : true,
    }
    ,
    manufacturer : {
        type : String,
    }
    ,
    model : {
        type : String,
    }
    ,
    year : {
        type : String,
    }
})

const VehicleModel = mongoose.model("VehicleModel",VehicleSchema);

module.exports = VehicleModel;