const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/', // 設定儲存路徑
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

// Init Upload 
const upload = multer({
  storage: storage,
  fileFilter: (req,file,cb)=>{
    checkFileType(req,file,cb)
  }
}).single('myImage');     
// 單張圖片 Key:myImage
function checkFileType(req,file,cb){
  const filetypes = /mp4|webm/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
      return cb(null, true);
  } else {
      req.fileValidationError = '不支援的檔案格式';
      return cb(null, false, new Error('goes wrong on the mimetype'));
  }
}

router.get('/test', (req, res) => {
  res.json({ msg: 'upload works' });
});

router.post('/upload',  (req, res) => {
  upload(req, res, (err) => {
      if (err) throw err;
      
      if(req.fileValidationError) {
        return res.json({msg:req.fileValidationError});
      }
      res.json({ msg: 'success' });
  });
});


module.exports = router;