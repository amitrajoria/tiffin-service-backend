const express = require("express");
const { connection } = require("./config/DB");
const { AuthController } = require("./routes/Auth.route");
const cors = require("cors");
const { ProfileController } = require("./routes/Profile.route");
const { VenderController } = require("./routes/Vender.route");
const { PGController } = require("./routes/PG.route");
const { TiffinController } = require("./routes/Tiffin.route");
const { CartController } = require("./routes/Cart.route");
const { OrderController } = require("./routes/Order.route");
const { CustomerController } = require("./routes/Customers.route");
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Home page');
})

app.use("/auth", AuthController);

app.use("/profile", ProfileController);

app.use("/venders", VenderController);

app.use("/pg", PGController);

app.use("/tiffins", TiffinController);

app.use("/cart", CartController);

app.use("/orders", OrderController);

app.use("/customers", CustomerController);

app.listen('8080', async (req, res) => {
    console.log("Server listening on 8080");
    try {
        await connection;
        console.log("Connected to DB");
    }
    catch (err) {
        console.log("Problem in DB connection ", err.message);
    }
    // console.log("Server listening on 8080");
})