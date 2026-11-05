import type { z } from "zod";
import type { VerifyRecordSchema } from "./schema";

/**
 * DEMO DATA ONLY. These records exist to demonstrate a lookup flow.
 * They are not certificates and this site is not a credential service.
 */
export const verifyRecords: z.input<typeof VerifyRecordSchema>[] = [
  {
    token: "DEMO-2026-A1B2",
    holder: "示例学员甲",
    programme: "示例课程：工作流设计入门",
    issuedOn: "2026-06-30",
    state: "valid",
  },
  {
    token: "DEMO-2026-C3D4",
    holder: "示例学员乙",
    programme: "示例课程：交付闭环实践",
    issuedOn: "2026-03-15",
    state: "revoked",
  },
];
