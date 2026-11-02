import { z } from "zod";

export const learnerSessionSchema = z.object({
  learnerId: z.string().min(1),
  courseId: z.string().min(1),
  deadline: z.coerce.date(),
  refreshToken: z.string().min(1),
  sessionId: z.string().min(1)
});

export type LearnerSession = z.infer<typeof learnerSessionSchema>;

export type SessionDecision = {
  learnerId: string;
  courseId: string;
  deadline: string;
  state: "active" | "deadline-passed";
};

export function decideSessionState(input: unknown, now: Date): SessionDecision {
  const session = learnerSessionSchema.parse(input);
  const state = session.deadline.getTime() >= now.getTime() ? "active" : "deadline-passed";
  return {
    learnerId: session.learnerId,
    courseId: session.courseId,
    deadline: session.deadline.toISOString(),
    state
  };
}
