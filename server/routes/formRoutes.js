const express = require('express');
const router = express.Router();
const {
  createForm, getAllForms, getFormById,
  submitResponse, getResponses, getAnalytics
} = require('../controllers/formController');

router.post('/', createForm);
router.get('/', getAllForms);
router.get('/:id', getFormById);
router.post('/:id/submit', submitResponse);
router.get('/:id/responses', getResponses);
router.get('/:id/analytics', getAnalytics);

module.exports = router;
