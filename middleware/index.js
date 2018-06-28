let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.session.userId) {
    return next();
  }
  console.log('User not logged in');
  res.redirect('/login');
}

module.exports = middlewareObj;