import { UserData } from "../models/UserData";
import { UserDataDB } from "./UserDataDB";

export class GetUserDataService {
    public getUserData = (): UserData => {
        // get userId from login
        return this.fetchUserData();
    }

    private fetchUserData = (): UserData => {
        //will be used to fetch data from server
        const userDataDB = new UserDataDB();
        const userProjects = userDataDB.projects;
        const projects = new Array<UserProject>();
        userProjects.forEach(project => {
            const projectInput = this.updateUserInput(project.projectData);
            const formattedProject = new UserProject(project.name, projectInput, project.projectTarget, project.startDate, project.endDate, this.calcCurrentStreak(projectInput), this.calcMaxStreak(projectInput), this.calcMaxWords(projectInput), this.calcMaxWordsDaily(projectInput));
            projects.push(formattedProject);
        })
        return new UserData(projects);
    }

    private updateUserInput = (userInput: (number | null)[]): (number | null)[] => {
        const updatedInput = new Array<number | null>();
        const currentDay = new Date().getDate();
        userInput.forEach((value, index) => {
            if (value == null && index <= currentDay) {
                value = userInput[index - 1];
            }
            updatedInput.push(value);
        });
        return updatedInput;
    }

    private calcCurrentStreak = (userInput: (number | null)[]): number => {
        let currentStreak = 0;
        let currentIndex = userInput.filter(v => v !== null).length - 1;
        const currentWords = userInput[currentIndex];

        if (currentWords == null || currentWords === userInput[currentIndex - 1]){
            return currentStreak;
        }

        currentStreak = 1;
        currentIndex = currentIndex - 1;

        let lastDay = userInput[currentIndex] ?? 0;

        while ((userInput[currentIndex - 1] ?? 0) < lastDay){
            currentStreak++;
            currentIndex = currentIndex - 1;
            lastDay = userInput[currentIndex ] ?? 0;
        }

        return currentStreak;
    }

    private calcMaxStreak = (userInput: (number | null)[]): number => {
        const streaks = new Array<number>();
        let currentStreak = 1;

        userInput.forEach((value, index) => {
            if (value != null) {
                if (index === 1 && value > 0) {
                    currentStreak = 1;
                }
                if (index > 1){
                    if (value > (userInput[index -1] ?? value)) {
                        currentStreak++;
                    } else {
                        streaks.push(currentStreak);
                        currentStreak = 0;
                    }
                }
            }
            else {
                streaks.push(currentStreak);
                currentStreak = 0;
            }
        });

        return streaks.reduce((a, b) => Math.max(a, b));
    }

    private calcMaxWords = (userInput: (number | null)[]): number => {
        return userInput.reduce((a, b) => Math.max(a ?? 0, b ?? 0)) ?? 0;
    }

    private calcMaxWordsDaily = (userInput: (number | null)[]): number => {
        const dailyInput = new Array<number>();

        userInput.forEach((value, index) => {
            if (index > 0){
                const lastValue = userInput[index - 1];
                const input = (value ?? 0) - (lastValue ?? 0);
                dailyInput.push(input);
            }
        });

        return dailyInput.reduce((a, b) => Math.max(a, b));
    }
}