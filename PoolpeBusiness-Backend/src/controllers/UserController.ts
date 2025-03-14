// import { AppDataSource } from "../db/data-source"
// import { NextFunction, Request, Response } from "express"
// import { Users } from "../entity/Users"
// const fs = require('fs');
// const file1 = './store.json';
// const uploadFile = require("../middlewares/upload");

// class UserController {

//     private userRepository = AppDataSource.getRepository(Users)

//     static listAll = async (req: Request, res: Response) => {
//       //Get users from database
//       const userRepository = AppDataSource.getRepository(Users)
//       const users = await userRepository.find({
//        where: {
//         is_admin: 0
//       },
//     });

//       //Send the users object
//       res.send(users);
//     };

//     static listAllOtherUser = async (req: Request, res: Response) => {
     
//       const userRepository = AppDataSource.getRepository(Users)
//       let id = res.locals.jwtPayload.userId;
//       let otherusers = [];
//       if (!(id )) {
//         return res.status(404).json({error: 1, status: 404, message : "Invalid Token."});
//       }
//       else{
//         const userRepository = AppDataSource.getRepository(Users)
//         const users = await userRepository.find({
//             where: {
//             is_admin: 0
//           },
//         });
//         let i = 0;
//         users.forEach(function(user){
//           if(user.id == id) {

//           }else{
            
//             otherusers[i] = user;
//             i++;
//           };
//         })
  
//         //Send the users object
        
//       }
//       res.send(otherusers);
//     };
    

      
//     /*
//     ** Get user by id
//     */
//     static getOneById = async (req: Request, res: Response) => {
//       //Get users from database

//       const userRepository = AppDataSource.getRepository(Users)
//       let id = res.locals.jwtPayload.userId;
      
//       if (!(id )) {
//         return res.status(404).json({error: 1, status: 404, message : "Invalid Token."});
//       }
//       else{
//         let user = await userRepository.findOneBy({ id })

//           let p = (payable[0].payable) ?? 0;
//           let r = (receivable[0].receivable) ?? 0;
//           totalpayable +=parseInt(p);
//           totalreceivable +=parseInt(r);
//         }

//         //let group_data = await groupRepository.findOneOrFail({ where: { id: group } });
//         return res.status(200).json({ status: 200, user:user, totalreceivable:totalreceivable,totalpayable:totalpayable,message : "Update User data successfully!" });

//       }
//     };

//     /*
//     ** Edit user by id
//     */

//     static editUser = async (req: Request, res: Response) => {

//       const userRepository = AppDataSource.getRepository(Users);
      
//       let id = res.locals.jwtPayload.userId;

//       if (!(id )) {
//       return res.status(404).json({error: 1, status: 404, message : "Invalid Token."});
//       }
//       try {

//         let { firstname, lastname, username } = req.body;
//         await userRepository.update({
//           id: id,
//         }, {
//           firstname: firstname,
//           lastname: lastname,
//           username: username
//         });

//         let updateduser = await userRepository.findOneBy({ id })

//         return res.status(201).json({ status: 201, data : updateduser, message : "Update User data successfully!" });
  
//       } catch (e) {
//         return res.status(409).json({ status: 409, message : "Error in user update." });
//       } 

//     };

//     async remove(req: Request, res: Response, next: NextFunction) {
//         const id = parseInt(req.locals.jwtPayload.userId)

//         let userToRemove = await this.userRepository.findOneBy({ id })

//         if (!userToRemove) {
//             return "this user not exist"
//         }

//         await this.userRepository.remove(userToRemove)

//         return "user has been removed"
//     } 

   
//     static upload = async (req: Request, res: Response) => {
//       //Get users from database
//       const userRepository = AppDataSource.getRepository(Users)
//       // let id = req.params.groupid;
      
//       // if (!(id )) {
//       //   return res.status(404).json({error: 1, status: 404, message : "Invalid Token."});
//       // }
//       // else{



//         // await uploadFile(req, res);

//         // if (req.file == undefined) {
//         //   return res.status(400).send({ message: "Please upload a file!" });
//         // }
//         // res.status(200).send({
//         //   message: "Uploaded the file successfully: " + req.file.originalname,
//         // });

//         try {
//           await uploadFile(req, res);
      
//           if (req.file == undefined) {
//             return res.status(400).send({ message: "Please upload a file!" });
//           }
      
//           res.status(200).send({
//             message: "Uploaded the file successfully: " + req.file.originalname,
//           });
//         } catch (err) {
//           console.log(err);
      
//           if (err.code == "LIMIT_FILE_SIZE") {
//             return res.status(500).send({
//               message: "File size cannot be larger than 2MB!",
//             });
//           }
      
//           res.status(500).send({
//             message: `Could not upload the file: ${req.file.originalname}. ${err}`,
//           });
       
//       }
//     };

//     static profilepicupload = async (req: Request, res: Response) => {

//         const userRepository = AppDataSource.getRepository(Users);
        
//         let id = res.locals.jwtPayload.userId;
//       if (!(id )) {
//         return res.status(404).json({error: 1, status: 404, message : "Invalid Token."});
//       }
//       else{


//         try {
//           await uploadFile(req, res);
          
//           // Read from file
//           const data = JSON.parse(fs.readFileSync(file1));
//           const name = data.name;
         

//           //console.log( "/uploads/profile/" + name)
//           if (req.file == undefined) {
//             return res.status(400).send({ message: "Please upload a file!" });
//           }
         
//           await userRepository.update({
//             id: id,
//           }, {
//             profile_picture:  "/uploads/profile/" + name
//           });
  
//           let updateduser = await userRepository.findOneBy({ id })
  
//           return res.status(200).json({ status: 200, data : updateduser, message : "Profile picture uploaded successfully!" });
  

//         } catch (err) {
//           console.log(err);
      
//           if (err.code == "LIMIT_FILE_SIZE") {
//             return res.status(500).send({
//               message: "File size cannot be larger than 2MB!",
//             });
//           }
      
//           res.status(500).send({
//             message: `Could not upload the file: ${req.file.originalname}. ${err}`,
//           });
      
//          }

        
       
//       }
//     };

// }
// module.exports = UserController;