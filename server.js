const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const port  = 5000

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req,res){
    res.send("running");
})

app.listen(port,function(){
    console.log("Ser running on port 500");
})