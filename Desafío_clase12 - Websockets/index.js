const express = require("express");
const path = require("path");
const { formatMessage } = require("./utils/utils");
// Data
const Products = require("./models/Products");
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

const products = new Products("data.json");

// Routes
app.get("/chat", (req, res) => {
	console.log(users);
	res.sendFile(__dirname + '/public/chat.html');
});

app.get("/", async (req, res) => {
	res.render("index", { mostrarForm: true });
});

app.get("/productos", async (req, res) => {
	res.render("index", {
		mostrarProductos: true,
		products: await products.getAll(),
	});
});

app.get("/productos/:id", async (req, res) => {
	const { id } = req.params;
	const product = await products.getById(id);
	res.render("index", { mostrarDetalle: true, product });
});

app.get("*", (req, res) => {
	res.status(404).send(`<h1>Path not found</h1>`);
});

app.post("/productos", async (req, res) => {
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

app.post('/login', (req, res) => {
	const { username } = req.body;
	if (users.find(user => user.username === username)) {
		return res.send("Username already taken");
	}
	res.redirect(`/chat?username=${username}`)
});

// Socket Events
io.on("connection", (socket) => {
	console.log("New client connection!");
	console.log(socket.id);

	// Getting all messages
	socket.emit('messages', [...messages]);

	// Welcome to chat
	socket.on("join-chat", (email) => {
		const newUser = {
			id: socket.id,
			email: email
		};
		users.push(newUser);
		// Bot Greetings
	})

	socket.on("new-message", async (msg) => {
		const user = users.find((user) => user.id === socket.id);
		const newMessage = formatMessage(socket.id, user.email, msg);
		messages.push(newMessage);
		products.saveMessage(user.email, msg, newMessage.time);

		// Creamos un documento txt donde almacenamos todos los mensajes enviados.
		fs.appendFile("conversacion.txt", JSON.stringify(data), (err) => {
			if (err) {
				throw err;
			}
			console.log(`Archive create sucessfull`);
		});

		io.emit("chat-message", newMessage);
	});

	const id = socket.id;
	socket.on("disconnect", () => {
		io.emit("disc", `${id}`);
		console.log(`disconect ${id}`);
	});
});

// Listen
const connectedServer = httpServer.listen(PORT, () => {
	console.log(`Server is up and running on port ${PORT} 🚀`);
});
connectedServer.on("error", (error) => {
	console.log(error);
});
