import express from "express";
const router = express.Router(); 
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import passport from "passport";

//Registro: 

// router.post("/", async (req, res) => {
//     const {first_name, last_name, email, password, age} = req.body; 

//     try {
//         //Verifico si el correo que recibo ya esta en la bd. 
//         const userExists = await UserModel.findOne({email:email});
//         if(userExists) {
//             return res.status(400).send("El correo electronico ya esta registrado");
//         }
//         const role = email === "admincoder@coder.com" ? "admin" : "user"
//         //Creo un nuevo usuario: 
//         const newUser = await UserModel.create({first_name, last_name, email, password, age, role});

//         //Armo la session: 
//         req.session.login = true;
//         req.session.user = {...newUser._doc}

//         res.redirect("/profile");

//     } catch (error) {
//         res.status(500).send("Error interno del servidor")
//     }
// })

// //Login: 

// router.post("/login", async (req, res) => {
//     const {email, password} = req.body;

//     try {
//         const user = await UserModel.findOne({email:email}); 
//         if(user) {
//             if(user.password === password) {
//                 req.session.login = true;
//                 req.session.user = {
//                     email: user.email, 
//                     age: user.age,
//                     first_name: user.first_name, 
//                     last_name: user.last_name
//                 }
//                 res.redirect("/profile");
//             } else {
//                 res.status(401).send("Contraseña no valida, moriras!");
//             }

//         } else {
//             res.status(404).send("Usuario no encontrado");
//         }
        
//     } catch (error) {
//         res.status(500).send("Error interno del servidor")
//     }

// })

// //Logout

// router.get("/logout", (req, res) => {
//     if(req.session.login) {
//         req.session.destroy();
//     }
//     res.redirect("/login");
// })



//PASSPORT
router.post("/", passport.authenticate("register", {
    failureRedirect: "/api/sessions/failedregister"}), async (req, res) => {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        };
        req.session.login = true;
        res.redirect("/profile");
    })

router.get("/failedregister", (req, res) => {
    res.send("Fallo al registrarse");
})

//Login. 

router.post("/login", passport.authenticate("login", { failureRedirect:"/api/sessions/faillogin"}), async (req, res) => {
    if(!req.user) return res.status(400).send("Credenciales invalidas");
    
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true; 

    res.redirect("/profile");

})

router.get("/faillogin", async (req, res) => {
    res.send("Falla en el inicio de sesión.");
})

//Logout
router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
        res.redirect("/login")
    }
})

//Acceso con github
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})

//Github callback
router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})


export default router; 