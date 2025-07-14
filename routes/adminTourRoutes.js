const express = require('express');
const router = express.Router();
const auth = require('../middleware/adminAuth');
const adminTourController = require('../controllers/adminTourController');

router.use(auth);

router.get('/', adminTourController.list);
router.get('/new', adminTourController.newForm);
router.post('/', adminTourController.create);
router.get('/:id/edit', adminTourController.editForm);
router.post('/:id/update', adminTourController.update);
router.post('/:id/delete', adminTourController.delete);

module.exports = router;
