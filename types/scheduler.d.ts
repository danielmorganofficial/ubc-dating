declare module 'scheduler' {
  export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  export type TimeBlock = "Morning" | "Afternoon" | "Evening";
  export type Availability = { day: DayOfWeek; time: TimeBlock };
  export function suggestMatchDate(a1: Availability[], a2: Availability[]): Availability | null;
}
