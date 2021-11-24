const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;

const db = require("./models");

app.use(cors()); 
app.use(express.json({strict: false}));

//Router
const cityRouter = require("./routes/City")
app.use("/city", cityRouter);

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("Server running at port: " + port);
    })
});
