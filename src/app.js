const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require("body-parser")


const app= express()
app.use(bodyParser.json())
const route=require('./route/route')
const port=3000;
// app.get("/",(req,res)=>{
//     res.send("this is my first api")
// })
mongoose.connect("mongodb+srv://sagar123singh:lIfGpUCFqV7Q8eSz@cluster0.vffzhqi.mongodb.net/test",{useNewUrlParser:true})
.then(()=>console.log("mongodb is connected"))
.catch(err=>console.log(err))

app.use("/",route)
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
});
