import multer from "multer";
// import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // safer absolute path
  },
  filename: function (req, file, cb) {
    // Rename file to avoid overwriting and remove spaces
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});



export const upload = multer({ storage });
