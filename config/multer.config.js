const path = require('path')
const multer  = require('multer');
const rootDir = require('../utils/path.utils');

let fileDirPath = path.join(rootDir,'files')
let fileDirPath1 = path.join(rootDir,'files','docs')

// console.log(fileDirPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileDirPath);              // folder to save file
  },
  filename: (req, file, cb) => {
    // console.log("request : " ,req);
    // console.log("file : " ,file);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext    = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique + ext);
  }
});
// const storage1 = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, fileDirPath1);              // folder to save file
//   },
//   filename: (req, file, cb) => {
//     // console.log("request : " ,req);
//     // console.log("file : " ,file);
//     const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const ext    = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + unique + ext);
//   }
// });


const upload = multer({ storage });
// const upload1 = multer({ storage });
// const upload2 = multer({ storage1 });

// module.exports = {upload1 ,upload2}
module.exports = upload