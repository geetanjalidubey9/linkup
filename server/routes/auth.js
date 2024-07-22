const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created uploads directory: ${uploadDir}`);
} else {
  console.log(`Uploads directory already exists: ${uploadDir}`);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Use resolved upload directory
  },
  filename: function (req, file, cb) {
    // Define how files should be named
    const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    console.log(`Saving file: ${filename}`);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only certain file types (e.g., images and PDFs)
    const fileTypes = /jpeg|jpg|png|pdf/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
      console.log(`File type accepted: ${file.originalname}`);
      cb(null, true);
    } else {
      cb(new Error('Error: File type not supported!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/Allusers',authController.getAllUsers);
router.post('/verify', authController.protect,authController.verifyOTP);
router.post('/send-otp', authController.protect, authController.sendOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/logout', authController.logout);

// Profile routes
router.get('/profile', authController.protect, authController.getProfile);
router.put('/profile/update', authController.protect, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'collegeid', maxCount: 1 }]), authController.updateProfile);
router.post('/profile/uploadphoto', authController.protect, upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    console.log('File uploaded:', req.file);
    // Assuming authController.uploadProfilePhoto handles further processing
    authController.uploadProfilePhoto(req, res);
  } catch (error) {
    console.error('Upload Photo Error:', error.message);
    res.status(400).json({ error: error.message });
  }
});
// Upload group profile photo route (assuming a different controller method)
router.post('/group/uploadphoto', authController.protect, upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    console.log('File uploaded:', req.file);
    // Assuming there's a different method for group photo upload in authController
    authController.uploadGroupProfilePhoto(req, res);
  } catch (error) {
    console.error('Upload Group Photo Error:', error.message);
    res.status(400).json({ error: error.message });
  }
});
// Error handling middleware for Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    console.error('Multer Error:', err.message);
    res.status(400).json({ error: err.message });
  } else if (err) {
    // Handle general errors
    console.error('General Error:', err.message);
    res.status(400).json({ error: err.message });
  } else {
    next();
  }
});

// Serve static files from the uploads directory
router.use('/uploads', express.static(uploadDir));

module.exports = router;


// const router = require('express').Router();

// const authController = require("../controllers/auth");
// console.log("hello");
// router.post('/register', authController.register);
// router.post("/login", authController.login);

// router.post('/verify', authController.verifyOTP);
// router.post('/send-otp', authController.sendOTP);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);


// router.get('/logout', authController.logout);


// module.exports = router;
