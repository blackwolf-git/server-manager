const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('../models');
const config = require('./config');

module.exports = function (passport) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret
  };

  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findByPk(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));
};
