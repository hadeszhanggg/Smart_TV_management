// app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const app = express();

const User = require('./models/user');

// Passport configuration
passport.use(
    new LocalStrategy((username, password, done) => {
        User.findByUsername(username, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (user.password !== password) {
                return done(null, false);
            }
            return done(null, user);
        });
    })
);
app.get('/register', (req, res) => {
    res.render('register');
});

// Xử lý yêu cầu đăng ký
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Sử dụng bcrypt để mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lưu thông tin người dùng vào cơ sở dữ liệu
        db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Đã xảy ra lỗi khi đăng ký người dùng.');
                } else {
                    res.status(200).send('Đăng ký thành công.');
                }
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).send('Đã xảy ra lỗi khi đăng ký người dùng.');
    }
    res.redirect('/login');
});
// Trang đăng nhập
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Lấy mật khẩu mã hóa và vai trò từ cơ sở dữ liệu
        db.query(
            'SELECT * FROM user WHERE username = ?',
            [username],
            async (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Đã xảy ra lỗi khi đăng nhập.');
                } else {
                    if (result.length > 0) {
                        // So sánh mật khẩu đã mã hóa với mật khẩu nhập vào
                        const isPasswordMatch = await bcrypt.compare(
                            password,
                            result[0].password
                        );

                        if (isPasswordMatch) {
                            res.status(200).send('Đăng nhập thành công.');
                        } else {
                            res.status(401).send('Tên đăng nhập hoặc mật khẩu không đúng.');
                        }
                    } else {
                        res.status(401).send('Tên đăng nhập hoặc mật khẩu không đúng.');
                    }
                }
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).send('Đã xảy ra lỗi khi đăng nhập.');
    }
    if (result[0].role === 'admin') {
        res.redirect('/admin');
    } else if (result[0].role === 'user') {
        res.redirect('/client');
    }
});
// Xử lý yêu cầu đăng nhập
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Fetch user by ID and return user object
    // Replace this with your actual implementation to fetch user by ID from the database
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/auth', authRouter);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
