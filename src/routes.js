const express = require('express');

const { userSignInValidator, userSignUpValidator } = require('./validators/auth');

const AuthController = require('./controllers/AuthController');
const CompaniesController = require('./controllers/CompaniesController');
const UsersController = require('./controllers/UsersController');

const routes = express.Router();

const authController = new AuthController();
routes.post('/auth/sign-up', userSignUpValidator, authController.signup);
routes.post('/auth/sign-in', userSignInValidator, authController.signin);
routes.post('/auth/refresh', authController.refresh);

const companiesController = new CompaniesController();
// '/create-company' is a special endpoint, that creates a company and its owner at the same time.
// it isn't named '/company' so that is possible to exclude it from JWT token check.
routes.post('/create-company', companiesController.create);
routes.put('/company/:id', companiesController.update);

const usersController = new UsersController();
routes.put('/user/:id', usersController.update);
routes.delete('/user/:id', usersController.delete);

module.exports = routes;
