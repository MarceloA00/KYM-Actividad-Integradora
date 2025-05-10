import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const API_BASE = '/api/students';

  const fetchStudents = async () => {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setStudents(data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${API_BASE}/${editingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    }
    setFormData({ name: '', age: '', grade: '', email: '' });
    setEditingId(null);
    fetchStudents();
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      age: student.age,
      grade: student.grade,
      email: student.email
    });
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    fetchStudents();
  };

  return (
    <div className="App">
      <h1>CRUD de Estudiantes</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Nombre"
          required
        />
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleInputChange}
          placeholder="Edad"
          required
        />
        <input
          name="grade"
          value={formData.grade}
          onChange={handleInputChange}
          placeholder="Grado"
          required
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <button type="submit">{editingId ? 'Actualizar' : 'Agregar'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Grado</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.grade}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => handleEdit(student)}>Editar</button>
                <button onClick={() => handleDelete(student._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;