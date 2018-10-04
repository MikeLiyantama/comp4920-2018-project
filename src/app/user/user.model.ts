export class User {
    public username;
    public name;
    public bio;
    public profilePic;
    
    // Use a dummy picture for now
    public profilePic;
    constructor (username, name, bio, profilePic) {
        this.username = username;
        this.name = name;
        this.bio = bio;
        this.profilePic = profilePic;
    }
}
