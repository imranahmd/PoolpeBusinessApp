const util = require("util");
const multer = require("multer");
const fs = require('fs');
const file1 = './store.json';
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let src =  __basedir.replace("/src", '')
    cb(null, src + "/public/uploads/profile");
  },
  filename: (req, file, cb) => {
    
    let dynamic_filename = Date.now() + file.originalname;
        
    let originalname = file.originalname;
   // Write to file
    fs.writeFileSync(file1, JSON.stringify({name: dynamic_filename}));
 
    cb(null, dynamic_filename);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;