module.exports = () => {
  const express    = require('express');
  const bodyParser = require('body-parser');
  const config     = require('config');
  let database   = {username: ``, password: ``, db: ``};
  const cors = require('cors')
  const app = express();
  app.use(cors())

  app.set('port', process.env.PORT || config.get('server.port'));
  app.set('serverPort', process.env.PORT || config.get('server.serverPort'));
  database = config.get('mysql') || undefined;
  app.use(express.json());
  
  app.use((error, req, res, next) => {
    if(error){
      return res.status(400).send({
        message: `Error`
      })
    }
    console.log(error)
    next()
  })

  return {app, database, express};
};