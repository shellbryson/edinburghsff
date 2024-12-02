import { ProjectDB } from "./ProjectDB";
import { UserProjectsDB } from "./UserProjectsDB";

export class UserDataDB {
    constructor() {
        this.id = 1;
        this.name = "Tristan";
        this.projects = new UserProjectsDB().userProjects;
    }

    
    id: number;
    name: string;
    projects: Array<ProjectDB>;
}