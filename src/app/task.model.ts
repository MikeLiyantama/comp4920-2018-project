export interface Task {
    _id?: string;
    title: string;
    description?: string;
    dueDate?: string;
    important?: boolean;
    completed?: boolean;
    deleted?: boolean;
}
