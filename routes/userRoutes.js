const express = require('express');
const userController = require('../controllers/userController');
const {
  signup,
  login,
  logout,
  protect,
  restrictTo,
} = require('../controllers/authController');

const {
  addAddress,
  getAddress,
  getAddressById,
  editAddress,
  removeAddress,
  setDefault,
} = require('../controllers/addressController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.use(protect);

router.get('/get-me', userController.getMyProfile);
router.put('/update-me', userController.updateMe);

router.put('/address/set-defaul/:id', setDefault);
router.route('/address').post(addAddress).get(getAddress);
router
  .route('/address/:id')
  .get(getAddressById)
  .put(editAddress)
  .delete(removeAddress);

router.use(protect, restrictTo);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
