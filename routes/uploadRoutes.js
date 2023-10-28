const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const express = require('express');
const multer = require('multer');
const { collection } = require('../models/productModel');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({ storage, fileFilter });
const uploadImage = upload.array('image', 4);

router.post('/', (req, res) => {
  uploadImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: 'Image uploaded successfully',
      url: `/${req.files[0].filename}`,
      path: `/${req.files[0].path}`,
    });
  });
});

router.delete('/', async (req, res) => {
  const { imageName } = req.body;

  if (!imageName) {
    return res.status(400).json({ message: 'Image name is required' });
  }
  try {
    const imagePath = path.join(__dirname, '../uploads', imageName);

    const response = await unlinkAsync(imagePath);
    console.log(response);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting the image' });
  }
});

module.exports = router;
