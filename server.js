import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mysqlSession from 'express-mysql-session';

const app = express();

//global middleware
app.use(cookieParser());
app.use(express.static('./public'))
app.set("view engine", "pug");
app.set("views", "./views");

const options = {
    host: "localhost",
    port: 3306,
    user: "adsouza",
    password: "tdb0WFK6t4B7",
    database: "session"
}
const MySqlStore = mysqlSession(session);
const sessionStore = new MySqlStore(options);

// confgigure session
app.use(session({
    secret: "49283c1c-4023-49fe-8972-780084a318ca",
    saveUninitialized: true,
    resave: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        maxAge: 30 * 60 * 1000 // 30 minutes
    }
    
}))

await sessionStore.onReady();
console.log('Session store is ready!');

//routes
app.get("/login", (req, res) => {
    // set some sessiond ata
    req.session.user = {
        name: "Alston Dsouza",
        emai: "alston.dsouza@greenriver.edu"
    }

    req.session.analytics = {
        pageViews: {
            dark: 0,
            light: 0,
            home: 0
        },
        totalViews: 0
    }

    res.redirect("/")
})

app.get("/", (req, res) => {
    
    // writing cookies
    const EXPIRE = 30 * 60 * 1000; //Millis
    res.cookie('lang', 'en', { maxAge: EXPIRE });
    res.cookie('lastVisited', new Date().toISOString(), { maxAge: EXPIRE });
    res.cookie('name', 'Alston', { maxAge: EXPIRE });

    // write sessiond ata
    req.session.analytics.pageViews.home++;
    req.session.analytics.totalViews++;

    // reading cookies
    const theme = req.cookies.theme;
    res.status(200).render("home", {
        theme,
        analytics: req.session.analytics
    });
})

app.get("/page", (req, res) => {
    res.status(200).render("page");
})

app.get("/theme/dark", (req, res) => {
    const EXPIRE = 30 * 60 * 1000; //Millis
    res.cookie('theme', 'dark-mode', { maxAge: EXPIRE });

    // write sessiond ata
    req.session.analytics.pageViews.dark++;
    req.session.analytics.totalViews++;

    res.redirect("/");
})

app.get("/theme/light", (req, res) => {
    const EXPIRE = 30 * 60 * 1000; //Millis
    res.cookie('theme', 'light-mode', { maxAge: EXPIRE });

    // write sessiond ata
    req.session.analytics.pageViews.light++;
    req.session.analytics.totalViews++;

    res.redirect("/");
})
const PORT = 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));