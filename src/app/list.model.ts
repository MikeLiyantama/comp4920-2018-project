import { Task } from './task.model';
import { User } from './user.model';

export interface List {
    _id?: string;
    title: string;
    createdAt?: string;
    createdBy?: User;
    deleted?: boolean;
    collaborators?: string[] | User[];
    teamID?: String;
}
