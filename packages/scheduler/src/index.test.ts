import test from "node:test";
import assert from "node:assert";
import { findCommonAvailability, suggestMatchDate, Availability } from "./index";

test("findCommonAvailability finds overlapping slots", () => {
  const userA: Availability[] = [
    { day: "Monday", time: "Morning" },
    { day: "Wednesday", time: "Evening" },
  ];
  const userB: Availability[] = [
    { day: "Tuesday", time: "Morning" },
    { day: "Wednesday", time: "Evening" },
    { day: "Saturday", time: "Afternoon" },
  ];

  const common = findCommonAvailability(userA, userB);
  assert.strictEqual(common.length, 1);
  assert.strictEqual(common[0].day, "Wednesday");
  assert.strictEqual(common[0].time, "Evening");
});

test("findCommonAvailability returns empty array when no overlap", () => {
  const userA: Availability[] = [{ day: "Monday", time: "Morning" }];
  const userB: Availability[] = [{ day: "Tuesday", time: "Morning" }];

  const common = findCommonAvailability(userA, userB);
  assert.strictEqual(common.length, 0);
});

test("suggestMatchDate returns a shared slot or null", () => {
  const userA: Availability[] = [{ day: "Monday", time: "Morning" }];
  const userB: Availability[] = [{ day: "Monday", time: "Morning" }];

  const suggestion = suggestMatchDate(userA, userB);
  assert.notStrictEqual(suggestion, null);
  assert.strictEqual(suggestion?.day, "Monday");
  assert.strictEqual(suggestion?.time, "Morning");

  const none = suggestMatchDate([{ day: "Monday", time: "Morning" }], [{ day: "Tuesday", time: "Morning" }]);
  assert.strictEqual(none, null);
});
