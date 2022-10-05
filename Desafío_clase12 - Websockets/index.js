const express = require("express");
const path = require("path");
const { formatMessage } = require("./utils/utils");
const Products = require("./models/data");
// Servidor con Socket
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const PORT = 8080 || process.env.PORT;
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

// Handlebars Config (Defino método Engine para HBS)
const { engine } = require("express-handlebars");
app.engine(
	"hbs",
	engine({
		extname: "hbs",
		defaultLayout: "main.hbs",
		layoutsDir: path.resolve(__dirname, "./views/layouts"),
		partialsDir: path.resolve(__dirname, "./views/partials"),
	})
);

app.set("views", "./views"); // Referencia a la carpeta que contiene las vistas
app.set("view engine", "hbs"); // Método - Motor de plantillas

// Variables
const messages = [];
const users = [];

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

const products = new Products();
const { items } = products;

// Routes
app.get("/api/productos", (req, res) => {
	res.json(items);
});

app.get("/", (req, res) => {
	res.render("index");
});

app.get("*", (req, res) => {
	res.status(404).send(`<h1>Path not found</h1>`);
});

app.post("/", async (req, res) => {
	const { title, price, thumbnail } = req.body;
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

// Socket Events
io.on("connection", (socket) => {
	console.log("New client connection! 🟩");
	console.log(socket.id);

	// Getting all items
	io.emit("items", [...items]);

	// Getting all messages
	io.emit('messages', [...messages]);

	// Welcome to chat
	socket.on("new-user", (email) => {
		const newUser = {
			id: socket.id,
			email: email
		};
		
		users.push(newUser);
	})

	socket.on("new-message", async (msg) => {
		const user = users.find((user) => user.id === socket.id);
		const newMessage = formatMessage(socket.id, user.email, msg);
		messages.push(newMessage);
		products.saveMessage(user.email, msg, newMessage.time);

		io.emit("chat-message", newMessage);
	});

	socket.on("disconnect", () => {
		io.emit("disc", socket.id);
		console.log("Client disconnected 🟥");
		console.log(socket.id);
	});
});

// Listen
const connectedServer = httpServer.listen(PORT, () => {
	console.log(`Server is up and running on port ${PORT} 🚀`);
});
connectedServer.on("error", (error) => {
	console.log(error);
});
