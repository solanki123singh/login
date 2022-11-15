const userSchema= require("../model/userModel")
const jwt=require("jsonwebtoken")


const register= async(req,res)=>{
    try{
    const body=req.body
    const requiredField=["firstName","email","phone","password"]
    for(i=0;i<requiredField.length;i++){
        if(body[requiredField[i]]===undefined){
            res.status(400).send({status:false,msg:`${requiredField[i]} is required`})
        }else if(body[requiredField[i]]===null || body[requiredField[i]]===" "){
            res.status(400).send({status:false,msg:`please enter ${requiredField[i]}`})
        }
    }

     if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/).test(body.email.trim())) {
     return res.status(400).send({ status: false, message: 'Enter a valid Email Id' });
     }

     const repeatedEmail= await userSchema.findOne({email:body.email})
     if(repeatedEmail){
        return res.status(400).send({status:false,msg:"Email already exists, please enter a different emailid"})
     }



     if (!(/^[6789]\d{9}$/).test(body.phone)) {
        return res.status(400).send({ status: false, message: 'The mobile number must be 10 digits and should be only Indian number' });
    }

    if(!(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/).test(body.password)){
        return res.status(400).send({status:false,message:"please enter alphanumeric and lowercase password"})
    }
    if (!(body.password.length > 8 && body.password.length <= 15)) {
        return res.status(400).send({status: false,message: 'Minimum password should be 8 and maximum will be 15'});
    }
     const repeatedPhone= await userSchema.findOne({phone:body.phone})
     if(repeatedPhone){
        return res.status(400).send({status:false,msg:"mobile number already exists, please enter a different mobile number"})
     }


    const registerData= await userSchema.create(body)
    res.status(201).send({status:true,msg:"registered successfully",data:registerData})
    }
    catch(error){
        return res.status(500).send({status:false,error:error.message})
    }
}
module.exports.register=register

const login=async(req,res)=>{
    try{
        const body= req.body
        const {email,password}=body


        if (Object.keys(body).length == 0) {return res.status(400).send({status: false,message: 'Email and Password fields are required'});
        }

        if (email===undefined || email.trim() == '') {
            return res.status(400).send({status: false,message: 'Email field is required ' });
        }

        if (password===undefined|| password.trim() == '') {
             return res.status(400).send({status: false,message: 'Password field is required '});
        }

        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/).test(body.email.trim())) {
            return res.status(400).send({ status: false, message: 'Enter a valid Email Id' });
        }

        const User=await userSchema.findOne({email:body.email})
        if(!User){
            res.status(404).send({status:false,msg:"user with emailid does not exists"})
        }else{
                const userPassword= await userSchema.findOne({password:body.password})
                if(userPassword){
                    const userID = User._id
                    const payLoad = { userId: userID }
                    const secretKey = "sagar123solanki"
        
                    // creating JWT
        
                    const token = jwt.sign(payLoad, secretKey, { expiresIn: "20hr" })
        
                    res.header("token", token)

                
            res.status(200).send({ status: true, message: " user login successful", data:  token  })

                }else{
                    res.status(404).send({status:false,msg:"Please enter correct email id and password"})
                }
        }

    }
    catch(error){
        return res.status(500).send({status:false,error:error.message})
    }
}

module.exports.login=login