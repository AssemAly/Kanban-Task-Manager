import { TaskPriority, TaskStatus } from "../Helpers/enums.js";

export interface Task {
  id: string;
  title: string;
  description?: string;

  priority: TaskPriority;
  status: TaskStatus;

  dueDate: Date;
}
