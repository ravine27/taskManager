import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosConfig';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import './TaskForms.css';

const AddTask = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await api.post('/tasks', { title, description, completed });
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-page">
      <Navbar />
      {loading && <Loader />}

      <main className="form-main">
        <div className="form-card">
          <h2 className="form-title">Create New Task</h2>

          {apiError && <div className="error-banner">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="title">Task Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
              />
              {errors.title && <div className="error-text">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task details..."
              ></textarea>
              {errors.description && <div className="error-text">{errors.description}</div>}
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="completed"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />
              <label htmlFor="completed">Mark as Completed</label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Task
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddTask;
