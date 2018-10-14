import { Task } from './task.model';

export interface List {
    _id?: string;
    title: string;
    createdAt?: string;
    createdBy?: string;
    deleted?: boolean;
    collaborators?: string[];
}
