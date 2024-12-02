export class ProjectDB {
    id!: number;
    name!: string;
    projectData!: Array<number | null>;
    projectTarget!: number;
    startDate!: Date;
    endDate!: Date;
}