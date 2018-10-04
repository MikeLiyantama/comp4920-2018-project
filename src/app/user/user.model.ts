export class User {
    public username;
    public name;
    public bio;
    
    // Use a dummy picture for now
    public profilePic;
    constructor (username, bio, profilePic) {
        this.username = username;
        this.bio = bio;
        this.profilePic = profilePic;
    }
}
