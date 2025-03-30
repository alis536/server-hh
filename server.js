const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'products.json');

app.use(cors());
app.use(express.json());

// Получение всех продуктов
app.get('/products', (req, res) => {
    const products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    res.json(products);
});

// Получение одного продукта по ID
app.get('/products/:id', (req, res) => {
    const products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    const product = products.find((p) => p.id == req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Добавление продукта
app.post('/products', (req, res) => {
    const products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
});

// Обновление продукта (исправленный код)
app.put('/products/:id', (req, res) => {
    let products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    const productIndex = products.findIndex((p) => p.id == req.params.id);
    
    if (productIndex !== -1) {
        // Гарантируем, что `id` не удаляется
        products[productIndex] = { ...products[productIndex], ...req.body, id: products[productIndex].id };
        fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
        res.json(products[productIndex]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});


// Удаление продукта
app.delete('/products/:id', (req, res) => {
    let products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    const newProducts = products.filter((p) => p.id != req.params.id);

    if (newProducts.length === products.length) {
        return res.status(404).json({ message: 'Product not found' });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(newProducts, null, 2));
    res.json({ message: 'Product deleted' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
