const request = require('supertest');
const app = require('../app');
const Student = require('../models/Student');
const mongoose = require('mongoose');

beforeAll(() => {
  mongoose.set('strictQuery', false);
});

describe('Student Routes', () => {
  beforeEach(async () => {
    await Student.deleteMany({});
  });

  describe('POST /api/students', () => {
    it('should create a new student', async () => {
      const studentData = {
        name: 'John Doe',
        age: 20,
        grade: 'A',
        email: 'john@example.com'
      };
      
      const response = await request(app)
        .post('/api/students')
        .send(studentData)
        .expect(201);
      
      expect(response.body.name).toBe(studentData.name);
      expect(response.body.email).toBe(studentData.email);
    });

    it('should return 400 for invalid data', async () => {
      const invalidStudentData = {
        name: 'John Doe',
        age: 'not a number',
        grade: 'A'
      };
      
      await request(app)
        .post('/api/students')
        .send(invalidStudentData)
        .expect(400);
    });
  });

  describe('GET /api/students', () => {
    it('should return all students', async () => {
      const students = [
        { name: 'John Doe', age: 20, grade: 'A', email: 'john@example.com' },
        { name: 'Jane Doe', age: 21, grade: 'B', email: 'jane@example.com' }
      ];
      
      await Student.insertMany(students);
      
      const response = await request(app)
        .get('/api/students')
        .expect(200);
      
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe(students[0].name);
      expect(response.body[1].name).toBe(students[1].name);
    });
  });

  describe('GET /api/students/:id', () => {
    it('should return a student by id', async () => {
      const student = await Student.create({
        name: 'John Doe',
        age: 20,
        grade: 'A',
        email: 'john@example.com'
      });
      
      const response = await request(app)
        .get(`/api/students/${student._id}`)
        .expect(200);
      
      expect(response.body.name).toBe(student.name);
      expect(response.body._id).toBe(student._id.toString());
    });

    it('should return 404 for non-existent student', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app)
        .get(`/api/students/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PATCH /api/students/:id', () => {
    it('should update a student', async () => {
      const student = await Student.create({
        name: 'John Doe',
        age: 20,
        grade: 'A',
        email: 'john@example.com'
      });
      
      const updates = { name: 'John Updated', age: 21 };
      
      const response = await request(app)
        .patch(`/api/students/${student._id}`)
        .send(updates)
        .expect(200);
      
      expect(response.body.name).toBe(updates.name);
      expect(response.body.age).toBe(updates.age);
      expect(response.body.grade).toBe(student.grade); // unchanged field
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should delete a student', async () => {
      const student = await Student.create({
        name: 'John Doe',
        age: 20,
        grade: 'A',
        email: 'john@example.com'
      });
      
      await request(app)
        .delete(`/api/students/${student._id}`)
        .expect(200);
      
      const deletedStudent = await Student.findById(student._id);
      expect(deletedStudent).toBeNull();
    });
  });
});