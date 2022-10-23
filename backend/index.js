import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UseRoute.js";
import LeaveLetterRoute from "./routes/LeaveLetterRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);
//tao table session de luu tru cac session
const store = new sessionStore({
    db: db
});

// (async () => { //tao cac bang trong csdl
//     await db.sync();
// })();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(UserRoute);
app.use(LeaveLetterRoute);
app.use(AuthRoute);

// store.sync(); //dung de tao bang session trong csdl -> chi thuc hien 1 lan

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});
