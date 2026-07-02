import React from 'react';
import { FiEdit2, FiTrash2, FiCheckCircle, FiCircle } from 'react-icons/fi';
import './TaskCard.css';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <button 
          className="toggle-complete-btn" 
          onClick={() => onToggleComplete(task)}
          title={task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
        >
          {task.completed ? (
            <FiCheckCircle className="icon-completed" />
          ) : (
            <FiCircle className="icon-incomplete" />
          )}
        </button>
        
        <div className="task-info">
          <h4 className="task-title">{task.title}</h4>
          {task.description && <p className="task-desc">{task.description}</p>}
        </div>
      </div>

      <div className="task-actions">
        <button className="action-btn edit-btn" onClick={() => onEdit(task.id)} title="Edit Task">
          <FiEdit2 />
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(task.id)} title="Delete Task">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
