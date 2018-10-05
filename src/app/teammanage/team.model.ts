export class Team {
    public name;
    public description;
    public members; // Leaders are listed amongst members
    public creator; // Always has full set of privileges
    constructor (name, description, creator, leaders, members) {
        this.name = name;
        this.description = description;
        this.creator = creator;
        this.leaders = leaders;
        this.members = members;
    }

}
