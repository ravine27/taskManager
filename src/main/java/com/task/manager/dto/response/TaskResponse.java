package com.task.manager.dto.response;

import com.task.manager.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private String proofDescription;
    private Long userId;
    private String assignedUserName;
    private String assignedUserEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
