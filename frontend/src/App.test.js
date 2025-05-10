import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the fetch API
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('App Component', () => {
  it('renders the student CRUD title', () => {
    render(<App />);
    expect(screen.getByText('CRUD de Estudiantes')).toBeInTheDocument();
  });

  it('displays the student form', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Edad')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Grado')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByText('Agregar')).toBeInTheDocument();
  });

  it('allows input values to be changed', () => {
    render(<App />);
    
    const nameInput = screen.getByPlaceholderText('Nombre');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
    
    const ageInput = screen.getByPlaceholderText('Edad');
    fireEvent.change(ageInput, { target: { value: '20' } });
    expect(ageInput.value).toBe('20');
  });

  it('submits the form to add a new student', async () => {
    render(<App />);
    
    // Mock the fetch for getting students after adding
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ _id: '1', name: 'John Doe', age: 20, grade: 'A', email: 'john@example.com' }]),
      })
    );
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Edad'), { target: { value: '20' } });
    fireEvent.change(screen.getByPlaceholderText('Grado'), { target: { value: 'A' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Agregar'));
    
    // Wait for the mock fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // Initial load + after submit
    });
  });

  it('edits an existing student', async () => {
    const mockStudents = [
      { _id: '1', name: 'John Doe', age: 20, grade: 'A', email: 'john@example.com' }
    ];
    
    // Mock initial fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStudents),
      })
    );
    
    render(<App />);
    
    // Wait for students to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Click edit button
    fireEvent.click(screen.getByText('Editar'));
    
    // Check if form is populated
    expect(screen.getByPlaceholderText('Nombre').value).toBe('John Doe');
    expect(screen.getByText('Actualizar')).toBeInTheDocument();
    
    // Change the name
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'John Updated' } });
    
    // Mock the update response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(),
      })
    );
    
    // Mock the fetch for getting updated students
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ _id: '1', name: 'John Updated', age: 20, grade: 'A', email: 'john@example.com' }]),
      })
    );
    
    // Submit the update
    fireEvent.click(screen.getByText('Actualizar'));
    
    // Wait for the update to complete
    await waitFor(() => {
      expect(screen.getByText('John Updated')).toBeInTheDocument();
    });
  });

  it('deletes a student', async () => {
    const mockStudents = [
      { _id: '1', name: 'John Doe', age: 20, grade: 'A', email: 'john@example.com' }
    ];
    
    // Mock initial fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStudents),
      })
    );
    
    render(<App />);
    
    // Wait for students to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Mock the delete response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(),
      })
    );
    
    // Mock the fetch for getting students after delete
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
    
    // Click delete button
    fireEvent.click(screen.getByText('Eliminar'));
    
    // Wait for the student to be removed
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });
});