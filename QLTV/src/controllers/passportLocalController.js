import passport from "passport";
import passportLocal from "passport-local";
import loginService from "../services/loginService";

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
    passport.use("localLogin", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
        async (email, password, done) => {
            try {
                await loginService.findUserByEmail(email).then(async (user) => {
                    if (!user) return done(null, false, { message: `Email "${email}" không hợp lệ!!!` })

                    if (user) {
                        let match = await loginService.compareUserPassword(user, password);
                        if (match === true) return done(null, user, { role: user.role });
                        return done(null, false, { message: "Mật khẩu không hợp lệ!!!" });
                    }
                });
            } catch (err) {
                return done(null, false, { message: err });
            }
        }));
};

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    loginService.findUserById(id).then((user) => {
        return done(null, user);
    }).catch(error => {
        return done(error, null)
    });
});

module.exports = initPassportLocal;