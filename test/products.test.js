const express = require('express');
const chai = require('chai');
const expect = chai.expect;
const app = express();
const request = require('supertest');

describe('Productos', () => {
  // Prueba GET /api/products
  it('Debe obtener una lista de productos', (done) => {
    request(app)
      .get('/api/products')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // Prueba POST /api/products
  it('Debe crear un nuevo producto', (done) => {
    const newProduct = {
      name: 'Nuevo Producto',
      price: 10.99,
    };
    request(app)
      .post('/api/products')
      .send(newProduct)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        done();
      });
  });

  // Prueba GET /api/products/:id
  it('Debe obtener un producto por ID', (done) => {
    const productId = 'your-product-id'; // Reemplaza con un ID válido
    request(app)
      .get(`/api/products/${productId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', productId);
        done();
      });
  });


});
