import { User } from '../user/user.model';
export class TeamMember {
    public user: User;
    public isCreator;
    public isLeader;

    constructor (user, isCreator, isLeader) {
        this.user = user;
        this.isCreator = isCreator;
        this.isLeader = isLeader;
    }

}
