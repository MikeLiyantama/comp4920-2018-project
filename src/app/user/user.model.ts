export class User {
    public name;
    public username;
    public email;
    public password;
    public bio;
    public profile;

    constructor (name, username, email, password, bio, profile) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.profile = profile;
    }
}
