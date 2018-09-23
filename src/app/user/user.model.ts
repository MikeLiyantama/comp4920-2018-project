export class User {
    public username;
    public name;
    
    // Use a dummy picture for now
    public profilePic;
    constructor (username, profilePic) {
        this.username = username;
        this.profilePic = profilePic;
    }
}
