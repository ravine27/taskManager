import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosConfig';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import Loader from '../components/Loader';
import ConfirmationModal from '../components/ConfirmationModal';
import { AuthContext } from '../context/AuthContext';
import { FiPlus } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
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

  const handleApproveTask = async (id) => {
    setLoading(true);
    setApiError('');
    try {
      const response = await api.put(`/tasks/${id}/approve`);
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'COMPLETED' } : t));
      setSuccessMsg('Task approved and completed.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to approve task.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProof = async (id, proofDescription) => {
    setLoading(true);
    setApiError('');
    try {
      const response = await api.put(`/tasks/${id}`, {
        title: tasks.find(t => t.id === id).title,
        proofDescription
      });
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'PENDING_APPROVAL', proofDescription } : t));
      setSuccessMsg('Work proof submitted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to submit proof.');
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

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="dashboard-page">
      <Navbar />
      {loading && <Loader />}
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">{isAdmin ? 'All Assigned Tasks' : 'Your Tasks'}</h2>
            <p className="dashboard-subtitle">
              {isAdmin ? 'Manage, track, and approve user tasks' : 'View your assigned work and submit completion proof'}
            </p>
          </div>
          {isAdmin && (
            <button className="add-task-btn" onClick={() => navigate('/add-task')}>
              <FiPlus />
              <span>Add Task</span>
            </button>
          )}
        </div>

        {apiError && <div className="error-banner">{apiError}</div>}
        {successMsg && <div className="success-banner">{successMsg}</div>}

        <div className="dashboard-content">
          <TaskList
            tasks={tasks}
            user={user}
            onApprove={handleApproveTask}
            onSubmitProof={handleSubmitProof}
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
