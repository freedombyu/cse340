const { Router } = require('express');
const {buildByClassificationId} = require('../controllers/invController');

const inventoryRouter = new Router();

inventoryRouter.get('/type/:classificationId', buildByClassificationId);

module.exports = inventoryRouter;
