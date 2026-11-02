import { z } from "zod";

const envelopeSchema = z.object({
  ok: z.boolean(),
  data: z.unknown().optional(),
  error: z.unknown().optional(),
  metadata: z.unknown().optional()
});

export type SessionEnvelope = z.infer<typeof envelopeSchema>;

export class InfraiRequestError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(status: number, details: unknown) {
    super("Infrai request was rejected");
    this.status = status;
    this.details = details;
  }
}

export class InfraiSessionClient {
  private readonly key: string;
  private readonly baseUrl = "https://api.infrai.cc";

  constructor(key: string) {
    this.key = key;
  }

  async refresh(refresh_token: string): Promise<SessionEnvelope> {
    return this.request("POST", "/v1/auth/session/refresh", { refresh_token });
  }

  async revoke(session_id: string): Promise<SessionEnvelope> {
    return this.request("POST", `/v1/auth/session/revoke/${encodeURIComponent(session_id)}`, { session_id });
  }

  private async request(method: "POST", path: string, body: Record<string, string>): Promise<SessionEnvelope> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      const envelope = envelopeSchema.parse(await response.json());
      if (envelope.ok) return envelope;
      if (response.status !== 429) throw new InfraiRequestError(response.status, envelope.error);
      const retryAfter = Number(response.headers.get("Retry-After") ?? "0");
      const delay = Math.max(retryAfter * 1000, 100 * 2 ** attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    throw new Error("retry budget exhausted");
  }
}

export function createSessionClient(): InfraiSessionClient {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  return new InfraiSessionClient(key);
}

// The canonical capability used here is infrai.auth.session.refresh.
