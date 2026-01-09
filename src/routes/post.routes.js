const express = require('express');
const controller = require('../controllers/post.controller');

const router = express.Router();

router.post('/', controller.create);
router.get('/search', controller.search);
router.get('/:id', controller.getById);
router.get('/', controller.getAll);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove)

module.exports = router;