import { UserProject } from "./UserProject";

export class UserData {
    constructor(projects: Array<UserProject>) {
        this.projects = projects;
    }

    projects: Array<UserProject>;
}