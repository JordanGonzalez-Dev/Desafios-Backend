const fs = require('fs/promises')

module.exports = class Products {
	constructor(name) {
		this.name = name;
	}

	async getFile() {
		try {
			const content = await fs.readFile(`./${this.name}`, 'utf-8');
			return JSON.parse(content);
		} catch (error) {
			console.log(error);
		}
	}

	async assignId() {
		try {
			const file = await this.getFile();
			// console.log(file.indexOf(obj));
			file.forEach((item) => {
				if (!item.id) {
					item.id = file.indexOf(item) + 1;
				}
			})
			await fs.writeFile(`./${this.name}`, JSON.stringify(file, null, 2));
			return file;
		}
		catch (error) {
			console.log(error)
		}

	}

	async save(obj) {
		try {
			const file = await this.getFile();
			const lastIndex = file.length - 1;
			const lastId = file[lastIndex].id;
			obj.id = lastId + 1;
			file.push(obj);
			await fs.writeFile(`./${this.name}`, JSON.stringify(file, null, 2));
			return obj.id;
		} catch (error) {
			console.log(error);
		}
	}

	async getById(id) {
		try {
			const file = await this.getFile();
			const array = file.filter((product) => product.id === +id);
			if (array.length === 0) {
				return false;
			} else {
				return array[0];
			}
		} catch (error) {
			console.log(error);
		}
	}

	async getAll() {
		try {
			const file = await this.getFile();
			// console.log(file)
			return file;
		} catch (error) {
			console.log(error);
		}
	}

	async deleteById(id) {
		try {
			const file = await this.getFile();
			const filteredArray = file.filter((product) => product.id !== +id)
			if (filteredArray.length === file.length) {
				return { error: 'producto no encontrado' };
			} else {
				await fs.writeFile(`./${this.name}`, JSON.stringify(filteredArray, null, 2));
				return;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async deleteAll() {
		try {
			const empty = [];
			await fs.writeFile(`./${this.name}`, JSON.stringify(empty))
		} catch (error) {
			console.log(error);
		}
	}
}
