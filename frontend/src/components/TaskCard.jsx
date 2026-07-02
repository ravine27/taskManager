import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiSend } from 'react-icons/fi';
import './TaskCard.css';

const TaskCard = ({ task, user, onApprove, onSubmitProof, onEdit, onDelete }) => {
  const [proofText, setProofText] = useState('');
  const [showProofForm, setShowProofForm] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case 'COMPLETED': return 'status-completed';
      case 'PENDING_APPROVAL': return 'status-pending';
      default: return 'status-assigned';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Completed';
      case 'PENDING_APPROVAL': return 'Pending Approval';
      default: return 'Assigned';
    }
  };

  const handleProofSubmit = (e) => {
    e.preventDefault();
    if (!proofText.trim()) return;
    onSubmitProof(task.id, proofText);
    setShowProofForm(false);
    setProofText('');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className={`task-card status-${task.status?.toLowerCase()}`}>
      <div className="task-body">
        <div className="task-header-row">
          <span className={`status-badge ${getStatusClass(task.status)}`}>
            {getStatusLabel(task.status)}
          </span>
          {isAdmin && (
            <span className="assigned-user-info">
              Assigned to: <strong>{task.assignedUserName}</strong> ({task.assignedUserEmail})
            </span>
          )}
        </div>

        <div className="task-info">
          <h4 className="task-title">{task.title}</h4>
          {task.description && <p className="task-desc">{task.description}</p>}
        </div>

        {task.proofDescription && (
          <div className="task-proof-section">
            <span className="proof-label">Submission Proof:</span>
            <p className="proof-content">{task.proofDescription}</p>
          </div>
        )}

        {/* User submits proof form */}
        {!isAdmin && task.status === 'ASSIGNED' && (
          <div className="proof-submission-area">
            {!showProofForm ? (
              <button className="submit-work-trigger" onClick={() => setShowProofForm(true)}>
                Submit Completion Proof
              </button>
            ) : (
              <form onSubmit={handleProofSubmit} className="proof-form">
                <textarea
                  placeholder="Describe your completed work as proof..."
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  rows="2"
                  required
                />
                <div className="proof-form-actions">
                  <button type="button" className="btn-cancel-small" onClick={() => setShowProofForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit-small">
                    <FiSend /> Send Proof
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="task-card-sidebar">
        {/* Admin actions */}
        {isAdmin && (
          <div className="task-actions">
            {task.status === 'PENDING_APPROVAL' && (
              <button className="action-btn approve-btn" onClick={() => onApprove(task.id)} title="Approve Task">
                <FiCheck /> Approve
              </button>
            )}
            <button className="action-btn edit-btn" onClick={() => onEdit(task.id)} title="Edit Task">
              <FiEdit2 />
            </button>
            <button className="action-btn delete-btn" onClick={() => onDelete(task.id)} title="Delete Task">
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
