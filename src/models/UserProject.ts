export class UserProject {
    constructor(name: string, dailyInputs: Array<number | null>, target: number, startDate:Date, endDate: Date, currentStreak: number, maxStreak: number, maxWords: number, maxWordsDaily: number) {
        this.name = name;
        this.dailyInputs = dailyInputs;
        this.target = target;
        this.startDate = startDate;
        this.endDate = endDate;
        this.currentStreak = currentStreak;
        this.maxStreak = maxStreak;
        this.maxWords = maxWords;
        this.maxWordsDaily = maxWordsDaily;
    }

    name: string;
    dailyInputs: Array<number | null>;
    target: number;
    startDate: Date;
    endDate: Date;
    currentStreak: number;
    maxStreak: number;
    maxWords: number;
    maxWordsDaily: number;
}