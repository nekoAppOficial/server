const auth = require('../controllers/users/auth');
const register = require('../controllers/users/register');
const validationToken = require('../controllers/users/validationToken');
const profile = require('../controllers/users/profile');
const changePhoto = require('../controllers/users/config/changePhoto');
const search = require('../controllers/users/search');

module.exports = conn => {
    return [
        {
        route: `/auth`,
        controller: auth(conn),
        method: `post`
    },{
        route: `/profile`,
        controller: profile(conn),
        method: `post`
    }, 
    {
        route: `/auth/register`,
        controller: register(conn),
        method: `post`
    },  
    {
        route: `/auth/validationToken`,
        controller: validationToken(conn),
        method: `post`
    },  
    {
        route: `/profile/changePhoto`,
        controller: changePhoto(conn),
        method: `post`
    },{
        route: `/search`,
        controller: search(conn),
        method: `post`
    },]
}
