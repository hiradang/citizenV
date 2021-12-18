const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const port = 3001;

const db = require("./models");

app.use(cookieParser());
app.use(cors()); 
app.use(express.json({strict: false}));
// res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
// res.setHeader('Access-Control-Allow-Credentials', true)
// app.use(function(req, res, next) { 
//     // res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); 
//     res.header('Access-Control-Allow-Credentials', true); 
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); 
//     next(); 
// });

//Router
const authRouter = require("./routes/Account")
app.use("/account", authRouter);

const cityRouter = require("./routes/City")
app.use("/city", cityRouter);

const districtRouter = require("./routes/District")
app.use("/district", districtRouter);

const wardRouter = require("./routes/Ward")
app.use("/ward", wardRouter);

const hamletRouter = require("./routes/Hamlet")
app.use("/hamlet", hamletRouter);

const taskRouter = require("./routes/Task")
app.use("/task", taskRouter);

const citizenRouter = require("./routes/Citizen")
app.use("/citizen", citizenRouter);


db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("Server running at port: " + port);
    })
});
