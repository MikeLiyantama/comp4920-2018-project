export class Task {
    public title;
    public description;
    public importance;
    public dueDate;
    public completed;
    public deleted;
    constructor (title, description, importance, dueDate) {
        this.title = title;
        this.description = description;
        this.importance = importance;
        this.dueDate = dueDate;
    }

}
