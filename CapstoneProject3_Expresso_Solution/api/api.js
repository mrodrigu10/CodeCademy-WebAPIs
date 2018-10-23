const express = require('express');
const apiRouter = express.Router();


//step 12
module.exports = apiRouter;

//step 19
const apiRouterMenus = require('./menus');
apiRouter.use('/menus', apiRouterMenus);

//step 38
const apiRouterEmployees = require('./employees');
apiRouter.use('/employees', apiRouterEmployees);
