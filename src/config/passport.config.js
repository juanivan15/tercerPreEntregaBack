import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
//Traigo el modelo y las funciones de bcrypt
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import GitHubStrategy from "passport-github2";

const initializePassport = () => {
    //Estrategia de registro 
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",

    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;
        try {
            //Verifico si el mail existe
            let user = await UserModel.findOne({ email });
            if (user) return done(null, false);
            
            let newUser = { 
                first_name, last_name, email, age, password: createHash(password)
            }
            let result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))
    
    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            let user = await UserModel.findOne({ email });
            if (!user) {
                console.log("Usuario no existe");
                return done(null, false);
            }
            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    //Serializar usuarios
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id:id});
        done(null, user);
    })

    passport.use("github", new GitHubStrategy({
        clientID:"Iv1.8a66ff9b394ff65c",
        clientSecret: "2e9e5b5595bbb0a858d2d86f6f1ca69b4a92006b",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        //Chequeo que todo funciona bien 
        //console.log("Perfil del usuario:", profile);
        try {
            let user = await UserModel.findOne({email:profile._json.email});

            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "Usuario",
                    age: 26,
                    email: profile._json.email,
                    password: "hackerserial",
                }
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

export default initializePassport; 