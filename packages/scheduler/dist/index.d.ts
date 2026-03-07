export type TimeBlock = "Morning" | "Afternoon" | "Evening";
export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export interface Availability {
    day: DayOfWeek;
    time: TimeBlock;
}
/**
 * Finds all overlapping availability slots between two users.
 * @param userA Availability array for user A
 * @param userB Availability array for user B
 * @returns Array of overlapping availability slots
 */
export declare function findCommonAvailability(userA: Availability[], userB: Availability[]): Availability[];
/**
 * Selects a random common availability slot, or returns null if none exist.
 */
export declare function suggestMatchDate(userA: Availability[], userB: Availability[]): Availability | null;
