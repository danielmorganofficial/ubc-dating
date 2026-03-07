"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
const index_1 = require("./index");
(0, node_test_1.default)("findCommonAvailability finds overlapping slots", () => {
    const userA = [
        { day: "Monday", time: "Morning" },
        { day: "Wednesday", time: "Evening" },
    ];
    const userB = [
        { day: "Tuesday", time: "Morning" },
        { day: "Wednesday", time: "Evening" },
        { day: "Saturday", time: "Afternoon" },
    ];
    const common = (0, index_1.findCommonAvailability)(userA, userB);
    node_assert_1.default.strictEqual(common.length, 1);
    node_assert_1.default.strictEqual(common[0].day, "Wednesday");
    node_assert_1.default.strictEqual(common[0].time, "Evening");
});
(0, node_test_1.default)("findCommonAvailability returns empty array when no overlap", () => {
    const userA = [{ day: "Monday", time: "Morning" }];
    const userB = [{ day: "Tuesday", time: "Morning" }];
    const common = (0, index_1.findCommonAvailability)(userA, userB);
    node_assert_1.default.strictEqual(common.length, 0);
});
(0, node_test_1.default)("suggestMatchDate returns a shared slot or null", () => {
    const userA = [{ day: "Monday", time: "Morning" }];
    const userB = [{ day: "Monday", time: "Morning" }];
    const suggestion = (0, index_1.suggestMatchDate)(userA, userB);
    node_assert_1.default.notStrictEqual(suggestion, null);
    node_assert_1.default.strictEqual(suggestion?.day, "Monday");
    node_assert_1.default.strictEqual(suggestion?.time, "Morning");
    const none = (0, index_1.suggestMatchDate)([{ day: "Monday", time: "Morning" }], [{ day: "Tuesday", time: "Morning" }]);
    node_assert_1.default.strictEqual(none, null);
});
