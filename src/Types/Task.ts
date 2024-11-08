import { Dayjs } from "dayjs";

export enum Priority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
  }
  
export enum Status {
    TODO = 'Todo',
    DOING = 'Doing',
    DONE = 'Done',
    WARNING = 'Warning',
    PENDING = 'Pending',
    FAILED = 'Failed'
  }
  
export interface Task {
    id: number;
    title: string;
    priority: Priority;
    dateTime: Dayjs;
    estimate: number;
    status: Status;
    hash: string;
  }