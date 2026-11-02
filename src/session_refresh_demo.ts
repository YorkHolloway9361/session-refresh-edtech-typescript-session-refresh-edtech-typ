import { createSessionClient } from "./infrai_session_client.ts";
import { decideSessionState, learnerSessionSchema } from "./session_policy.ts";

const input = learnerSessionSchema.parse({
  learnerId: "learner-17",
  courseId: "course-privacy-101",
  deadline: "2030-06-30T23:59:59.000Z",
  refreshToken: process.env.REFRESH_TOKEN ?? "local-refresh-token",
  sessionId: "session-17"
});

const decision = decideSessionState(input, new Date());
console.log(JSON.stringify({ report: decision }, null, 2));

if (process.env.INFRAI_API_KEY) {
  const client = createSessionClient();
  const refreshed = await client.refresh(input.refreshToken);
  if (!refreshed.ok) throw new Error("refresh was rejected");
  console.log(JSON.stringify({ refreshed: true }, null, 2));
}
