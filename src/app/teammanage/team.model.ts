export class Team {
    public _id;
    public name;
    public description;
    public members; // Leaders are listed amongst members
    public creator; // Always has full set of privileges
    public leaders;
    public banner;
    public createdBy;

    constructor (name, description, creator, members, banner) {
        this.name = name;
        this.description = description;
        this.creator = creator;
        this.members = members;
        this.banner = banner;
    }

}
