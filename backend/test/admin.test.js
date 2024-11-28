const request = require('supertest');
const express = require('express');
const { adminModel } = require('./../db/index');
const {adminRouter} = require('./../routes/admin');
const jwt = require('jsonwebtoken');

jest.mock('./../db/index');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/admin', adminRouter);

describe('POST /signup', () => {
  it('should return 202 if admin is added successfully', async () => {
    adminModel.create.mockResolvedValue({});

    const response = await request(app)
      .post('/admin/signup')
      .send({
        email: 'admin@example.com',
        password: 'password',
        firstName: 'Admin',
        lastName: 'User'
      });

    expect(response.status).toBe(202);
    expect(response.body.message).toBe('Admin added successfully');
  });

  it('should return 409 if email already exists', async () => {
    const duplicateKeyError = new Error('Duplicate key error');
    duplicateKeyError.code = 11000;
    adminModel.create.mockRejectedValue(duplicateKeyError);

    const response = await request(app)
      .post('/admin/signup')
      .send({
        email: 'admin@example.com',
        password: 'password',
        firstName: 'Admin',
        lastName: 'User'
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Admin Already exist');
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/admin/signup')
      .send({
        email: 'invalid-email',
        password: 'password',
        firstName: 'Admin',
        lastName: 'User'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('bad input');
  });

  it('should return 500 for generic database error', async () => {
    adminModel.create.mockRejectedValue(new Error('Generic database error'));

    const response = await request(app)
      .post('/admin/signup')
      .send({
        email: 'admin@example.com',
        password: 'password',
        firstName: 'Admin',
        lastName: 'User'
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Problem in database, cannot add Admin');
  });
});

describe('POST /signin', () => {
  it('should return 200 if admin is found and token is generated', async () => {
    const mockAdmin = {
      _id: '12345',
      email: 'admin@example.com',
      password: 'password'
    };
    adminModel.findOne.mockResolvedValue(mockAdmin);
    const mockToken = 'mockToken';
    jwt.sign.mockReturnValue(mockToken);

    const response = await request(app)
      .post('/admin/signin')
      .send({
        email: 'admin@example.com',
        password: 'password'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token', mockToken);
    expect(response.body.message).toEqual(mockAdmin);
  });

  it('should return 404 if admin is not found', async () => {
    adminModel.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/admin/signin')
      .send({
        email: 'admin@example.com',
        password: 'password'
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Admin is not present in database');
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/admin/signin')
      .send({
        email: 'invalid-email',
        password: 'password'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('bad input');
  });

  it('should return 500 for generic database error', async () => {
    adminModel.findOne.mockRejectedValue(new Error('Generic database error'));

    const response = await request(app)
      .post('/admin/signin')
      .send({
        email: 'admin@example.com',
        password: 'password'
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Can not fetch admin, Problem in the database');
  });
});