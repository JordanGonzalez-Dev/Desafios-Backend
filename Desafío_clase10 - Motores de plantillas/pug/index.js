const express = require("express");

const Products = require("./models/Products");

const app = express();
const PORT = 8080 || process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

// Middlewares
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

const products = new Products("data.json");

// Routes
app.get("/", async (req, res) => {
    res.render("addProduct");
});

app.get("/productos", async (req, res) => {
    const listaProductos = await products.getAll();
    res.render("index", {
        listaProductos
    });
});

app.get("/productos/:id", async (req, res) => {
    const {
        id
    } = req.params;
    const product = await products.getById(id);
    res.render("itemDetail", {
        product,
    });
});

app.post("/productos", async (req, res) => {
    const {
        title,
        price,
        thumbnail
    } = req.body;
    if (!title || !price || !thumbnail) {
        req.send("Error: invalid body format");
    }
    const newProduct = {
        title,
        price,
        thumbnail,
    };
    await products.save(newProduct);
    res.redirect("/");
});

const connectedServer = app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});
connectedServer.on("error", (error) => {
    console.log(error);
});