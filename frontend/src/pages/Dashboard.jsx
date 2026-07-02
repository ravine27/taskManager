import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosConfig';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import Loader from '../components/Loader';
import ConfirmationModal from '../components/ConfirmationModal';
import { FiPlus } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setApiError('');
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleComplete = async (task) => {
    setLoading(true);
    setApiError('');
    try {
      const updatedData = {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      };
      await api.put(`/tasks/${task.id}`, updatedData);
      
      // Update local state directly to be fast
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
      setSuccessMsg(`Task "${task.title}" updated.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to update task status.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/edit-task/${id}`);
  };

  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    setLoading(true);
    setApiError('');
    setIsDeleteModalOpen(false);

    try {
      await api.delete(`/tasks/${taskToDelete}`);
      setTasks(tasks.filter(t => t.id !== taskToDelete));
      setSuccessMsg('Task deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to delete task.');
    } finally {
      setLoading(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      {loading && <Loader />}
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">Your Tasks</h2>
            <p className="dashboard-subtitle">Manage and track your daily tasks</p>
          </div>
          <button className="add-task-btn" onClick={() => navigate('/add-task')}>
            <FiPlus />
            <span>Add Task</span>
          </button>
        </div>

        {apiError && <div className="error-banner">{apiError}</div>}
        {successMsg && <div className="success-banner">{successMsg}</div>}

        <div className="dashboard-content">
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </main>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default Dashboard;
