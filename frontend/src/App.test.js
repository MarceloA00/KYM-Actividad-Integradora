import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

afterEach(() => {
  cleanup();
});


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
  test('renders student CRUD title', () => {
    render(<App />);
    expect(screen.getByText('CRUD de Estudiantes')).toBeInTheDocument();
  });

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
    
  
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ _id: '1', name: 'John Doe', age: 20, grade: 'A', email: 'john@example.com' }]),
      })
    );
    

    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Edad'), { target: { value: '20' } });
    fireEvent.change(screen.getByPlaceholderText('Grado'), { target: { value: 'A' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });

    fireEvent.click(screen.getByText('Agregar'));
    

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('edits an existing student', async () => {
    const mockStudents = [
      { _id: '1', name: 'John Doe', age: 20, grade: 'A', email: 'john@example.com' }
    ];
    

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStudents),
      })
    );
    
    render(<App />);
    

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    

    fireEvent.click(screen.getByText('Editar'));
    

    expect(screen.getByPlaceholderText('Nombre').value).toBe('John Doe');
    expect(screen.getByText('Actualizar')).toBeInTheDocument();
    

    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'John Updated' } });
    

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(),
      })
    );
    

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ _id: '1', name: 'John Updated', age: 20, grade: 'A', email: 'john@example.com' }]),
      })
    );
    

    fireEvent.click(screen.getByText('Actualizar'));
    

    await waitFor(() => {
      expect(screen.getByText('John Updated')).toBeInTheDocument();
    });
  });

  it('deletes a student', async () => {
    const mockStudents = [
      { _id: '1', name: 'John Doe', age: 20, grade: 'A', email: 'john@example.com' }
    ];
    

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStudents),
      })
    );
    
    render(<App />);
    

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(),
      })
    );
    

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
    

    fireEvent.click(screen.getByText('Eliminar'));
    

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });
});