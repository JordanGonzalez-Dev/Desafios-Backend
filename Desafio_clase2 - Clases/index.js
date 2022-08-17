class Usuario {

    constructor(nombre, apellido, libros, mascotas) {

        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName() {

        return `${this.nombre} ${this.apellido}`
    }

    addMascota(mascota) {

        this.mascotas.push(mascota)
    }

    countMascotas() {

        return this.mascotas.length 
    }

    addBook(titulo, autor) {

        this.libros.push({
            titulo: titulo,
            autor: autor
        })
    }

    getBookNames() {

        return this.libros.map(({titulo}) => titulo)
    }

}

const user = new Usuario( "Jordan", "Gonzalez", [{ titulo: "Odisea" }, { autor: "Homero" }, { titulo: "El señor de los anillos" }, { autor: "Tolkien" }], [ "Sheena", "Loki" ]);


// USUARIO
console.log(user);

// NOMBRE COMPLETO
console.log(user.getFullName());

// AGREGO MASCOTA
user.addMascota("Juan");

// UPDATE MASCOTA NUEVA
console.log(user.mascotas);

// CANTIDAD DE MASCOTAS
console.log(user.countMascotas());

// AGREGAR LIBRO
user.addBook("Harry Potter" , "J.K.Rowling");

// LIBROS
console.log(user.libros);

// NOMBRE DE LOS LIBROS
console.log(user.getBookNames());