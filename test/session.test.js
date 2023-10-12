const express = require('express');
const chai = require('chai');
const expect = chai.expect;
const app = express();
const request = require('supertest');

describe('Sesiones', () => {
  // Prueba POST /api/sessions/login
  it('Debe iniciar sesión con credenciales válidas', (done) => {
    const credentials = {
      username: 'usuario',
      password: 'contraseña',
    };

    request(app)
      .post('/api/sessions/login')
      .send(credentials)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  // Prueba POST /api/sessions/logout
  it('Debe cerrar sesión de un usuario autenticado', (done) => {
    // Realiza una solicitud de inicio de sesión para obtener un token válido (tokenDummy)
    const tokenDummy = 'your-valid-token'; // Reemplaza con un token válido

    request(app)
      .post('/api/sessions/logout')
      .set('Authorization', `Bearer ${tokenDummy}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Sesión cerrada');
        done();
      });
  });



});
