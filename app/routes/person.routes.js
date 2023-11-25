const personController = require('../controllers/person.controller');
const router = require('express').Router();

router.post('/', personController.create);
router.get('/', personController.findAll);
router.delete('/:id', personController.delete);
router.get('/sent-mail', personController.sentBirthDayMail);
router.get('/set-birthday-status', personController.setBirthDayStatus);

module.exports = router;