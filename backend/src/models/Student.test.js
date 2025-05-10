const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Student = require('./Student');
const request = require('supertest');
const app = require('../app');

let mongoServer;

beforeAll(() => {
  mongoose.set('strictQuery', false);
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Student Model', () => {
  it('should create and save a student successfully', async () => {
    const studentData = {
      name: 'John Doe',
      age: 20,
      grade: 'A',
      email: 'john@example.com'
    };
    const student = new Student(studentData);
    const savedStudent = await student.save();

    expect(savedStudent._id).toBeDefined();
    expect(savedStudent.name).toBe(studentData.name);
    expect(savedStudent.age).toBe(studentData.age);
    expect(savedStudent.grade).toBe(studentData.grade);
    expect(savedStudent.email).toBe(studentData.email);
  });

  it('should fail if required fields are missing', async () => {
    const studentData = {
      age: 20,
      grade: 'A'
    };
    const student = new Student(studentData);
    
    await expect(student.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should fail if email is not unique', async () => {
    const studentData1 = {
      name: 'John Doe',
      age: 20,
      grade: 'A',
      email: 'john@example.com'
    };
    const studentData2 = {
      name: 'Jane Doe',
      age: 21,
      grade: 'B',
      email: 'john@example.com'
    };
    
    await Student.create(studentData1);
    await expect(Student.create(studentData2)).rejects.toThrow(mongoose.Error.MongoServerError);
  });
});