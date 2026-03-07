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
export function findCommonAvailability(userA: Availability[], userB: Availability[]): Availability[] {
  if (!userA || !userB) return [];

  const common: Availability[] = [];

  for (const slotA of userA) {
    const isShared = userB.some(slotB => slotA.day === slotB.day && slotA.time === slotB.time);
    if (isShared) {
      common.push(slotA);
    }
  }

  return common;
}

/**
 * Selects a random common availability slot, or returns null if none exist.
 */
export function suggestMatchDate(userA: Availability[], userB: Availability[]): Availability | null {
  const common = findCommonAvailability(userA, userB);
  if (common.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * common.length);
  return common[randomIndex];
}
