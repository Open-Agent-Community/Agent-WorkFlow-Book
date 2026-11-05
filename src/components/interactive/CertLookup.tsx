"use client";

import { useState } from "react";

/** 证书核验（§3.2 /verify）：演示数据，区分有效／已撤销／未找到，公开字段脱敏。 */

interface DemoCert {
  token: string;
  status: "有效" | "已撤销";
  holder: string; // 已脱敏
  course: string;
  issuer: string;
  issuedAt: string;
  revokeReason?: string;
}

const DEMO_CERTS: DemoCert[] = [
  { token: "YQ-DEMO-0001", status: "有效", holder: "张 *", course: "R-PATH-01 第一个工作流（示例）", issuer: "智能体工作流设计（演示签发主体）", issuedAt: "2026-10-01" },
  { token: "YQ-DEMO-0002", status: "已撤销", holder: "李 *", course: "企业 AI 通识（示例）", issuer: "智能体工作流设计（演示签发主体）", issuedAt: "2026-09-20", revokeReason: "课程版本更正，走撤销与重签流程" },
];

export function CertLookup({ initialToken }: { initialToken?: string }) {
  const [token, setToken] = useState(initialToken ?? "");
  const [result, setResult] = useState<DemoCert | "none" | null>(
    initialToken ? (DEMO_CERTS.find((c) => c.token === initialToken.trim().toUpperCase()) ?? "none") : null
  );

  const lookup = () => {
    const hit = DEMO_CERTS.find((c) => c.token === token.trim().toUpperCase());
    setResult(hit ?? "none");
  };

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup()}
          placeholder="输入证书编号，如 YQ-DEMO-0001"
          aria-label="证书编号"
          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 focus:border-accent-strong"
        />
        <button
          type="button"
          onClick={lookup}
          className="shrink-0 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-ink-950 hover:brightness-95"
        >
          查询
        </button>
      </div>
      <p className="mt-2 text-xs text-ink-600">
        演示数据：可试 YQ-DEMO-0001（有效）或 YQ-DEMO-0002（已撤销）。当前仅查询本页的两条演示记录，未接入正式证书服务。
      </p>

      {result === "none" && (
        <p className="mt-4 rounded-lg bg-ink-50 px-4 py-3 text-sm text-ink-600" role="status">
          未找到对应演示记录；这不代表真实证书无效，请通过页脚联系方式确认。
        </p>
      )}
      {result && result !== "none" && (
        <dl className="mt-4 rounded-xl border border-ink-100 p-5 text-sm">
          <div className="flex justify-between border-b border-ink-100 py-2">
            <dt className="text-ink-600">状态</dt>
            <dd className={result.status === "有效" ? "font-semibold text-accent-strong" : "font-semibold text-red-600"}>
              {result.status}
            </dd>
          </div>
          <div className="flex justify-between border-b border-ink-100 py-2">
            <dt className="text-ink-600">持有人（脱敏）</dt>
            <dd className="text-ink-900">{result.holder}</dd>
          </div>
          <div className="flex justify-between border-b border-ink-100 py-2">
            <dt className="text-ink-600">课程／路径</dt>
            <dd className="text-ink-900">{result.course}</dd>
          </div>
          <div className="flex justify-between border-b border-ink-100 py-2">
            <dt className="text-ink-600">签发主体</dt>
            <dd className="text-ink-900">{result.issuer}</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="text-ink-600">签发日期</dt>
            <dd className="text-ink-900">{result.issuedAt}</dd>
          </div>
          {result.revokeReason && (
            <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">撤销原因:{result.revokeReason}</p>
          )}
        </dl>
      )}
    </div>
  );
}
