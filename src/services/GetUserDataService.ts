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
        return new UserData(userInput, userTarget, this.calcMaxStreak(userInput), this.calcMaxWords(userInput));
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

    private calcMaxStreak = (userInput: (number | null)[]): number => {
        const streaks = new Array<number>();
        let currentStreak = 1;

        userInput.forEach((value, index) => {
            if (value != null) {
                if (index === 0 && value > 0) {
                    currentStreak = 1;
                }
                if (index > 0){
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