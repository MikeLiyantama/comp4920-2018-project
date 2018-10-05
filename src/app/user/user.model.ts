export class User {
    public name;
    public username;
    public email;
    public password;
    public bio;
    public profile;
    
    // Use a dummy picture for now
    constructor (name, username, email, password, bio, profile) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.bio = bio;
        this.profile = profile;
    }
}
