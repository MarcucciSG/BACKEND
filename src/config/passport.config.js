const passport = require("passport");
const jwt = require("passport-jwt");
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
const UserModel = require("../models/user.model.js");

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // Utiliza ExtractJwt.fromExtractors para extraer el token de la cookie
        secretOrKey: "coderhouse",
      },
      async (jwt_payload, done) => {
        try {
          // Busca el usuario en la base de datos usando el ID del payload JWT
          const user = await UserModel.findById(jwt_payload.user._id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user); // Devuelve el usuario encontrado
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //estrategia para GITHUB
  // //github strategy
  // const GitHubStrategy = require("passport-github2");

  // passport.use(
  //   "github",
  //   new GitHubStrategy(
  //     {
  //       clientID: "Iv1.b765065759912ea5",
  //       clientSecret: "1828af53b2adc5eab4aca7d581f17f1c6f606dec",
  //       callbackURL: "http://localhost:8080/api/sessions/githubcallback",
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       try {
  //         //nos fijamos si el usuario existe
  //         let user = await UserModel.findOne({ email: profile._json.email });
  //         //si no existe lo creamos
  //         if (!user) {
  //           let newUser = {
  //             first_name: profile._json.name,
  //             last_name: "",
  //             age: undefined,
  //             email: profile._json.email,
  //             password: "",
  //           };
  //           //guardamos el nuevo usuario en mongDB
  //           let result = await UserModel.create(newUser);
  //           done(null, result);
  //         } else {
  //           done(null, user);
  //         }
  //       } catch (error) {
  //         return done(error);
  //       }
  //     }
  //   )
  // );
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

module.exports = initializePassport;
