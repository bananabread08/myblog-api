import { TUser } from '../types/user';
import { MongooseError } from 'mongoose';
import passportJWT from 'passport-jwt';
import LocalStrategy from 'passport-local';
import User from '../models/User';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
import bcrypt from 'bcryptjs';

export const passportInit = (passport: any) => {
  passport.use(
    new LocalStrategy.Strategy(
      (username: string, password: string, done: Function) => {
        User.findOne({ username }, (err: MongooseError, user: TUser) => {
          if (err) return done(err);
          if (!user)
            return done(null, false, { message: 'Incorrect Username' });
          bcrypt.compare(password, user.password, (err: any, res) => {
            if (res) {
              // passwords match! log user in
              return done(null, user, { message: 'Logged in succesfully' });
            } else {
              // passwords do not match!
              return done(null, false, { message: 'Incorrect password' });
            }
          });
        });
      }
    )
  );

  //authorization
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload.user._id);
          return done(null, user!);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
