import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/axiosConfig';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import './TaskForms.css';

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setApiError('');
      try {
        const usersResponse = await api.get('/users');
        setUsers(usersResponse.data);

        const taskResponse = await api.get(`/tasks/${id}`);
        const task = taskResponse.data;
        setTitle(task.title);
        setDescription(task.description || '');
        setAssignedUserId(task.assignedUserId || '');
      } catch (err) {
        setApiError(err.response?.data?.message || 'Failed to fetch details.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!assignedUserId) {
      newErrors.assignedUserId = 'Assignee is required';
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
      await api.put(`/tasks/${id}`, { title, description, assignedUserId: Number(assignedUserId) });
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to update task.');
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
          <h2 className="form-title">Edit & Reassign Task</h2>

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

            <div className="form-group">
              <label htmlFor="assignedUserId">Assign User</label>
              <select
                id="assignedUserId"
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginTop: '6px',
                  outline: 'none',
                  backgroundColor: 'white',
                }}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              {errors.assignedUserId && <div className="error-text">{errors.assignedUserId}</div>}
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update Task
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditTask;
