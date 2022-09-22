const express = require('express');
const path = require('path');

const Products = require('./models/Products');

const app = express();
const PORT = 8080 || process.env.PORT;

// Handlebars Config
const { engine } = require('express-handlebars');
app.engine('hbs', engine({
	extname: 'hbs',
	defaultLayout: 'main.hbs',
	layoutsDir: path.resolve(__dirname, './views/layouts'),
	partialsDir: path.resolve(__dirname, './views/partials'),
}))
app.set('views', './views');
app.set('view engine', 'hbs');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

const products = new Products('data.json');

// Routes
app.get('/', async (req, res) => {
	res.render('index', { mostrarForm: true });
})

app.get('/productos', async (req, res) => {
	res.render('index', { mostrarProductos: true, products: await products.getAll() });
})

app.get('/productos/:id', async (req, res) => {
	const { id } = req.params;
	const product = await products.getById(id);
	res.render('index', ({ mostrarDetalle: true, product }));
})

app.post('/productos', async (req, res) => {
	const { title, price, thumbnail } = req.body;
	if (!title || !price || !thumbnail) {
		req.send('Error: invalid body format');
	}
	const newProduct = {
		title,
		price,
		thumbnail
	};
	await products.save(newProduct);
	res.redirect('/');
})

const connectedServer = app.listen(PORT, () => {
	console.log(`Server is up and running on port ${PORT}`);
})
connectedServer.on('error', (error) => {
	console.log(error);
})