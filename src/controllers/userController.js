const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
// const validator = require("../validator/validator")

let createUser = async function (req, res) {
    try {
        const requestBody=req.body
    if(!requestBody){
       return res.status(400).send({status:false,message:"invalid request parameter"})
    }
    const {name,title,email,phone,password}=requestBody

    if(!name){return res.status(400).send({status:false,message:"name is required"})}

    if(!email){return res.status(400).send({status:false,message:"email is required"})}

    if(!title){return res.status(400).send({status:false,message:"title is required"})}

    if(!phone){return res.status(400).send({status:false,message:"phone is required"})}

    if(!password){return res.status(400).send({status:false,message:"password is required"})}

    const isPhoneAlreadyUsed = await userModel.findOne({phone})

    if (isPhoneAlreadyUsed) {
      return res.status(400).send({ status: false, msg: `${phone} phone is already used` })
  }
  

  if(!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)))
  return res.status(400).send({ status: false, msg: " phone is invalid" })

  if(!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)))
  return res.status(400).send({ status: false, msg: " email is invalid" })


    const isemailAlreadyUsed=await userModel.findOne({email})

    if(isemailAlreadyUsed){return res.status(400).send({status:false,message:'email is already registred'})}
    
    
        let savedData = await userModel.create(requestBody)
        res.status(201).send({ msg: savedData })

    }
    catch (err) { res.status(500).send({ msg: err.message }) }
}
// ============================================================================================ //

// const userLogin = async function (req, res) {
//     try {
//        let data = req.body;
//        if (Object.entries(data).length == 0) {
//           res.status(400).send({ status: false, msg: "kindly pass Some Data" })
//        }
//        let username = req.body.email;
//        let password = req.body.password;
//        console.log(username,password)
//        let user = await userModel.findOne({ email: username, password: password });
//        if (!user)
//           return res.status(400).send({
//              status: false,
//              msg: "username or password is not correct",
//           });
//        let token = jwt.sign({
//           userId: user._id,
//           email: username
//        },
//           "third project"
//        );
//        res.setHeader("x-api-key", token);
//        res.status(200).send({ status: true, data: token })
  
//     }
//     catch (err) {
//        res.status(500).send({ status: false,Error: err.message })
//     }
//   }




  const userLogin = async function (req, res) {
   try{ 
    let data = req.body;
           if (Object.entries(data).length == 0) {
              res.status(400).send({ status: false, msg: "kindly pass Some Data" })
           }

       let userName = req.body.email;
    let password = req.body.password;

     if(!password){
        return res.status(400).send({status:false, msg:"password is required"})
      }

      if(!userName){
        return res.status(400).send({status:false, msg:"email is required"})
      }
  
    let user = await userModel.findOne({ email: userName });
    
   
    if (!user)
      return res.send({
        status: false,
        msg: "email not correct",
      });

      let user1 = await userModel.findOne({ password: password})

      if (!user1)
      return res.send({
        status: false,
        msg: "password not correct",
      });
  
  
    let token = jwt.sign(
      {
        authorId: user._id.toString(),
    
      },
      "mykey"
    );
    res.setHeader("x-api-key", token);
    res.status(201).send({ status: true, data: token });
    } catch (err){
        res.status(500).send({ status: false,Error: err.message })
    }
  };
module.exports.createUser = createUser
module.exports.userLogin=userLogin