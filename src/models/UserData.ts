export class UserData {
    constructor(dailyInputs: Array<number | null>, target: number, maxStreak: number, maxWords: number) {
        this.dailyInputs = dailyInputs;
        this.target = target;
        this.maxStreak = maxStreak;
        this.maxWords = maxWords;
    }

    dailyInputs: Array<number | null>;
    target: number;
    maxStreak: number;
    maxWords: number;
}