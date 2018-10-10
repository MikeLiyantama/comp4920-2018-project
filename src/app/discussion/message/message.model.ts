export class Message {
    public content;
    public author;
    public date;
    constructor (content, author, date) {
        this.content = content;
        this.author = author;
        this.date = date;
    }
}
