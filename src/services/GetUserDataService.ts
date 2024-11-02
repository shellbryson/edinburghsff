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
        const userInput = this.updateUserInput(userDataDB.getUserInput());
        const userTarget = userDataDB.getUserTarget();
        return new UserData(userInput, userTarget, this.calcCurrentStreak(userInput), this.calcMaxStreak(userInput), this.calcMaxWords(userInput));
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

        if (userInput[currentIndex] == null){
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
}