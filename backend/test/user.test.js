const request = require('supertest');
const express = require('express');
const { userModel } = require('../db/index');
const {userRouter} = require('../routes/user');
const jwt = require('jsonwebtoken');

jest.mock('./../db/index');
jest.mock('jsonwebtoken');

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

  it('should return 409 if email already exists', async () => {
    const duplicateKeyError = new Error('Duplicate key error');
    duplicateKeyError.code = 11000;
    userModel.create.mockRejectedValue(duplicateKeyError);

    const response = await request(app)
      .post('/user/signup')
      .send({
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe'
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User Already exist');
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/user/signup')
      .send({
        email: 'invalid-email',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('bad input');
  });

  it('should return 500 for generic database error', async () => {
    userModel.create.mockRejectedValue(new Error('Generic database error'));

    const response = await request(app)
      .post('/user/signup')
      .send({
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe'
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Problem in database, cannot add user');
  });
});





describe('POST /signin', () => {
  it('should return 200 if user is found and token is generated', async () => {
    const mockUser = {
      _id: '12345',
      email: 'test@example.com',
      password: 'password'
    };
    userModel.findOne.mockResolvedValue(mockUser);
    const mockToken = 'mockToken';
    jwt.sign.mockReturnValue(mockToken);

    const response = await request(app)
      .post('/user/signin')
      .send({
        email: 'test@example.com',
        password: 'password'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token', mockToken);
    expect(response.body.message).toEqual(mockUser);
  });

  it('should return 404 if user is not found', async () => {
    userModel.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/user/signin')
      .send({
        email: 'test@example.com',
        password: 'password'
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User is not present in database');
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/user/signin')
      .send({
        email: 'invalid-email',
        password: 'password'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('bad input');
  });

  it('should return 500 for generic database error', async () => {
    userModel.findOne.mockRejectedValue(new Error('Generic database error'));

    const response = await request(app)
      .post('/user/signin')
      .send({
        email: 'test@example.com',
        password: 'password'
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Can not fetch user, Problem in the database');
  });
});