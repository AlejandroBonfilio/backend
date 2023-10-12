const express = require('express');
const chai = require('chai');
const expect = chai.expect;
const app = express();
const request = require('supertest');

describe('Carritos', () => {
  // Declarar un token de autenticación válido para un usuario (adaptar según tu lógica de autenticación)
  let authToken = '';

  before((done) => {
    // Realiza una solicitud de inicio de sesión y guarda el token en authToken
    const credentials = {
      username: 'usuario',
      password: 'contraseña',
    };

    request(app)
      .post('/api/sessions/login')
      .send(credentials)
      .end((err, res) => {
        authToken = res.body.token; // Guarda el token aquí
        done();
      });
  });

  // Prueba POST /api/carts
  it('Debe crear un nuevo carrito para un usuario autenticado', (done) => {
    request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${authToken}`) 
      .expect(201) // Espera un código de respuesta 201
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  // Prueba GET /api/carts/:cid
  it('Debe obtener un carrito por su ID', (done) => {
    const cartId = 'your-cart-id'; // Reemplaza con un ID válido
    request(app)
      .get(`/api/carts/${cartId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', cartId);
        done();
      });
  });

  // Prueba DELETE /api/carts/:cid
  it('Debe eliminar un carrito por su ID', (done) => {
    const cartId = 'your-cart-id'; // Reemplaza con un ID válido
    request(app)
      .delete(`/api/carts/${cartId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Carrito eliminado');
        done();
      });
  });



});
