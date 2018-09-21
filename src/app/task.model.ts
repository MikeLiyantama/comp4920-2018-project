export class Task {
    public _id;
    public title;
    public description;
    public dueDate;
    public important;
    public completed;
    public deleted;
    
    constructor (title, description, dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
    }

}
