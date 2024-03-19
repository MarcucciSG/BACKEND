const passport = require("passport");
const local = require("passport-local");

//github strategy
const GitHubStrategy = require("passport-github2");

const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");

const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true, // le decis que queres acceder al objeto request
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          //verificamos si ya existe un registro con ese email
          let user = await UserModel.findOne({ email: email });
          if (user) return done(null, false);
          //si no existe, creo un registro nuevo
          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          let result = await UserModel.create(newUser);
          //si todo resulta bien, podemos mandar done con el usuario generado
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //agregamos otra estrategia, para el login
  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          //primero verifico si existe un usuario con ese email
          const user = await UserModel.findOne({ email });
          if (!user) {
            console.log("Este usuario no existe");
            return done(null, false);
          }
          //si existe verifico la contrasela
          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  //estrategia para GITHUB

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.b765065759912ea5",
        clientSecret: "1828af53b2adc5eab4aca7d581f17f1c6f606dec",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          //nos fijamos si el usuario existe
          let user = await UserModel.findOne({ email: profile._json.email });
          //si no existe lo creamos
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: undefined,
              email: profile._json.email,
              password: "",
            };
            //guardamos el nuevo usuario en mongDB
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
