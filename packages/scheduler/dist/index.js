"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommonAvailability = findCommonAvailability;
exports.suggestMatchDate = suggestMatchDate;
/**
 * Finds all overlapping availability slots between two users.
 * @param userA Availability array for user A
 * @param userB Availability array for user B
 * @returns Array of overlapping availability slots
 */
function findCommonAvailability(userA, userB) {
    if (!userA || !userB)
        return [];
    const common = [];
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
function suggestMatchDate(userA, userB) {
    const common = findCommonAvailability(userA, userB);
    if (common.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * common.length);
    return common[randomIndex];
}
