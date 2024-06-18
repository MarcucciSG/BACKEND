const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const UserDTO = require("../dto/user.dto.js");
const { generateResetToken } = require("../utils/tokenreset.js");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const EmailManager = require("../Service/emails.js");
const emailManager = new EmailManager();



class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const existeUsuario = await UserModel.findOne({ email });
      if (existeUsuario) {
        return res.status(400).send("El usuario ya existe");
      }

      //Creo un nuevo carrito:
      const nuevoCarrito = new CartModel();
      await nuevoCarrito.save();

      const nuevoUsuario = new UserModel({
        first_name,
        last_name,
        email,
        cart: nuevoCarrito._id,
        password: createHash(password),
        age,
      });

      await nuevoUsuario.save();

      const token = jwt.sign({ user: nuevoUsuario }, "coderhouse", {
        expiresIn: "1h",
      });

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const usuarioEncontrado = await UserModel.findOne({ email });

      if (!usuarioEncontrado) {
        return res.status(401).send("Usuario no válido");
      }

      const esValido = isValidPassword(password, usuarioEncontrado);
      if (!esValido) {
        return res.status(401).send("Contraseña incorrecta");
      }

      const token = jwt.sign({ user: usuarioEncontrado }, "coderhouse", {
        expiresIn: "1h",
      });

      usuarioEncontrado.last_connection = new Date();
      await usuarioEncontrado.save();

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async profile(req, res) {
    //Con DTO:
    const userDto = new UserDTO(
      req.user.first_name,
      req.user.last_name,
      req.user.role
    );
    const isAdmin = req.user.role === "admin";
    res.render("profile", { user: userDto, isAdmin });
  }

  async logout(req, res) {
    if (req.user) {
      try {        
        req.user.last_connection = new Date();
        await req.user.save();
      } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
        return;
      }
    }
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
  }

  async admin(req, res) {
    if (req.user.user.role !== "admin") {
      return res.status(403).send("Acceso denegado");
    }
    res.render("admin");
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body;
    try {
      //busco el usuario por correo
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).send("User not Found");
      }

      const token = generateResetToken(); //esta en carpeta utils.

      user.resetToken = {
        token: token,
        expire: new Date(Date.now() + 3600000),
      };
      await user.save();

      //Envio de correo electronico con el enlace de restablecimiento de contraseña
      await emailManager.sendCorreoRestablecimiento(
        email,
        user.first_name,
        token
      );
      res.redirect("/confirmacion-envio");
    } catch (error) {
      res.status(500).send("Error del servidor");
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body;
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.render("passwordchange", { error: "Usuario no encontrado" });
      }
      //agarro el token y lo verifico
      const resetToken = user.resetToken;
      if (!resetToken || resetToken.token !== token) {
        return res.render("passwordreset", { error: "El token es invalido" });
      }
      //fijarse si el token expiró
      const time = new Date();
      if (time > resetToken.expire) {
        return res.render("passwordreset", { error: "El token es invalido" });
      }
      //fijarse si la contraseña es la misma que ya habia.
      if (isValidPassword(password, user)) {
        return res.render("passwordchange", {
          error: "La contraseña ingresada es igual a la antigua",
        });
      }
      //actualizar contraseña
      user.password = createHash(password);
      //Marcar como usado el token
      user.resetToken = undefined;
      await user.save();

      return res.redirect("/login");
    } catch (error) {
      return res
        .status(500)
        .render("passwordreset", { error: "Error interno del servidor" });
    }
  }

  async changeRolePremium(req, res) {
   const { uid } = req.params;
        try {
            const user = await userRepository.findById(uid);

            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Verificamos si el usuario tiene la documentacion requerida: 
            const documentRequire = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];

            const userDocuments = user.documents.map(doc => doc.name);

            const tieneDocument = documentRequire.every(doc => userDocuments.includes(doc));

            if (!tieneDocument) {
                return res.status(400).send("El usuario tiene que completar toda la documentacion requerida");
            }

            const newRol = user.role === "usuario" ? "premium" : "usuario";

            res.send(newRol); 

        } catch (error) {
            res.status(500).send("Error del servidor");
        }
  }
}

module.exports = UserController;
