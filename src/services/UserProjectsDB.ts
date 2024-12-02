import { ProjectDB } from "./ProjectDB";

export class UserProjectsDB {
    constructor(){
        this.userProjects = new Array<ProjectDB>();
        const EdNoWriMo2024 = new ProjectDB();
        EdNoWriMo2024.name = "EdNoWriMo 2024";
        EdNoWriMo2024.projectData = [
            0,
            681,
            890,
            1367,
            1770,
            2104,
            2229,
            2389,
            2514,
            2746,
            2878,
            3108,
            3239,
            3387,
            3529,
            3663,
            3663,
            3663,
            3663,
            3663,
            3663,
            3663,
            3663,
            3663,
            3663,
            3663,
            3663,
            3663,
            3663,
            3663,
            4079,
            ];
        EdNoWriMo2024.projectTarget = 20000;
        EdNoWriMo2024.startDate = new Date(2024, 10, 1);
        EdNoWriMo2024.endDate = new Date(2024, 10, 31);
            
        const EdNoWriMo2025 = new ProjectDB();
        EdNoWriMo2025.name = "EdNoWriMo 2025";
        EdNoWriMo2025.projectData = [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            ];
        EdNoWriMo2025.projectTarget = 20000;
        EdNoWriMo2025.startDate = new Date(2025, 2, 1);
        EdNoWriMo2025.endDate = new Date(2025, 2, 28);
        this.userProjects.push(EdNoWriMo2024);
        //this.userProjects.push(EdNoWriMo2025);
    }

    userProjects: Array<ProjectDB>
}