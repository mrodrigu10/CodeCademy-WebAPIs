const express = require('express');
const app = express();

//step 7
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');

// Logging Middleware
app.use(morgan('dev'));

//step 6
const PORT = process.env.PORT || 4000;

// Add middleware for handling CORS requests from index.html
app.use(cors());

// Add middware for parsing request bodies here:
app.use(bodyParser.json());


if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler())
};
// This conditional is here for testing purposes:
//step 8
if (!module.parent) {
  // Add your code to start the server listening at PORT below:
  app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
  });
}

//step 9
module.exports = app;

// Mount your existing apiRouter below at the '/api' path.
//step 13
const apiRouter = require('./api/api');
app.use('/api', apiRouter);
