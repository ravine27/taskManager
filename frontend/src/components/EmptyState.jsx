import React from 'react';
import { FiInbox } from 'react-icons/fi';
import './EmptyState.css';

const EmptyState = ({ message }) => {
  return (
    <div className="empty-state">
      <FiInbox className="empty-icon" />
      <p className="empty-message">{message || 'No tasks found. Create one to get started!'}</p>
    </div>
  );
};

export default EmptyState;
