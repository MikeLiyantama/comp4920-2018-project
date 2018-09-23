export class Team {
    public name;
    public description;
    public members;
    public creator; // Always has full set of privileges
    public leaders; // Has a subset of privileges
    constructor (name, description, creator) {
        this.name = name;
        this.description = description;
        this.creator = creator;
    }

}
