export interface Task {
    _id?: string;
    title: string;
    createdAt?: string;
    createdBy?: string;
    orderDate?: string;
    description?: string;
    dueDate?: string;
    important?: boolean;
    completed?: boolean;
    deleted?: boolean;
    listId?: string;
    assignee?: string;
}
