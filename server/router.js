const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');

module.exports = function(app) {
  app.post('/signup', Authentication.signup)
}
