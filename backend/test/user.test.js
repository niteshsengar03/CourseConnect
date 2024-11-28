const request = require('supertest');
const express = require('express');
const { userModel } = require('../db/index');
const {userRouter} = require('../routes/user');

jest.mock('./../db/index');

const app = express();
app.use(express.json());
app.use('/user', userRouter);

describe('POST /signup', () => {
  it('should return 202 if user is added successfully', async () => {
    userModel.create.mockResolvedValue({});

    const response = await request(app)
      .post('/user/signup')
      .send({
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe'
      });

    expect(response.status).toBe(202);
    expect(response.body.message).toBe('User added successfully');
  });

  it('should return 404 if there is a database error', async () => {
    userModel.create.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/user/signup')
      .send({
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe'
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User has not added');
  });

  it('should return 404 if email is missing', async () => {
    const response = await request(app)
      .post('/user/signup')
      .send({
        password: 'password',
        firstName: 'John',
        lastName: 'Doe'
      });

    expect(response.status).toBe(404);
    expect(response.body).toBe('bad input');
  });

  it('should return 404 if password is missing', async () => {
    const response = await request(app)
      .post('/user/signup')
      .send({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      });

    expect(response.status).toBe(404);
    expect(response.body).toBe('bad input');
  });

  it('should return 404 if firstName is missing', async () => {
    const response = await request(app)
      .post('/user/signup')
      .send({
        email: 'test@example.com',
        password: 'password',
        lastName: 'Doe'
      });

    expect(response.status).toBe(404);
    expect(response.body).toBe('bad input');
  });

  it('should return 404 if lastName is missing', async () => {
    const response = await request(app)
      .post('/user/signup')
      .send({
        email: 'test@example.com',
        password: 'password',
        firstName: 'John'
      });

    expect(response.status).toBe(404);
    expect(response.body).toBe('bad input');
  });
});

