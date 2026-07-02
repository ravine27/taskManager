package com.task.manager.service.impl;

import com.task.manager.dto.request.TaskRequest;
import com.task.manager.dto.response.TaskResponse;
import com.task.manager.entity.Role;
import com.task.manager.entity.Task;
import com.task.manager.entity.User;
import com.task.manager.exception.ResourceNotFoundException;
import com.task.manager.repository.TaskRepository;
import com.task.manager.repository.UserRepository;
import com.task.manager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    public TaskResponse createTask(TaskRequest request) {
        User currentUser = getCurrentUser();
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .completed(request.getCompleted())
                .user(currentUser)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getMyTasks() {
        User currentUser = getCurrentUser();
        List<Task> tasks = taskRepository.findByUserId(currentUser.getId());
        return tasks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        User currentUser = getCurrentUser();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        validateOwnership(task, currentUser);

        return mapToResponse(task);
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest request) {
        User currentUser = getCurrentUser();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        validateOwnership(task, currentUser);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCompleted(request.getCompleted());

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {
        User currentUser = getCurrentUser();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        validateOwnership(task, currentUser);

        taskRepository.delete(task);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private void validateOwnership(Task task, User currentUser) {
        if (currentUser.getRole() != Role.ADMIN && !task.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to manage this task");
        }
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .completed(task.getCompleted())
                .userId(task.getUser().getId())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
