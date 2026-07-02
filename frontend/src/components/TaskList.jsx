import React from 'react';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import './TaskList.css';

const TaskList = ({ tasks, user, onApprove, onSubmitProof, onEdit, onDelete }) => {
  if (!tasks || tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          user={user}
          onApprove={onApprove}
          onSubmitProof={onSubmitProof}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
