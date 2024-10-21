export class UserData {
    constructor(dailyInputs: Array<number | null>, target: number, currentStreak: number, maxStreak: number, maxWords: number) {
        this.dailyInputs = dailyInputs;
        this.target = target;
        this.currentStreak = currentStreak;
        this.maxStreak = maxStreak;
        this.maxWords = maxWords;
    }

    dailyInputs: Array<number | null>;
    target: number;
    currentStreak: number;
    maxStreak: number;
    maxWords: number;
}