const express = require('express');

const CompaniesController = require('./controllers/CompaniesController');
const UsersController = require('./controllers/UsersController');

const routes = express.Router();

const companiesController = new CompaniesController();
routes.get('/company', companiesController.index);
routes.get('/company/:id', companiesController.select);
routes.post('/company', companiesController.create);
routes.put('/company/:id', companiesController.update);

const usersController = new UsersController();
routes.get('/user', usersController.index);
routes.get('/user/:id', usersController.select);
routes.post('/user', usersController.create);
routes.put('/user/:id', usersController.update);
routes.delete('/user/:id', usersController.update);

module.exports = routes;
