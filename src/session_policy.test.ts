import test from "node:test";
import assert from "node:assert/strict";
import { decideSessionState } from "./session_policy.ts";

test("a learner past the course deadline is reported as deadline-passed", () => {
  const result = decideSessionState({
    learnerId: "learner-17",
    courseId: "course-privacy-101",
    deadline: "2025-06-30T23:59:59.000Z",
    refreshToken: "refresh-value",
    sessionId: "session-17"
  }, new Date("2025-07-01T00:00:00.000Z"));

  assert.equal(result.state, "deadline-passed");
  assert.equal(result.courseId, "course-privacy-101");
});
