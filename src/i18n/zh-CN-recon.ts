/** zh-CN strings for the shipment reconciliation lab (发货对账 Agent). Merged under `labs.recon`. */
import { zhCNReconFix } from "./zh-CN-recon-fix";

/** Values the simulated Agent cites; all are pre-formatted from code results. */
export interface ReconNoteParams {
  shipment: string;
  invoices: string;
  refs: string;
  fields: string;
  /** Absolute differences, for sentences that already state the direction. */
  qty: string;
  amount: string;
  /** Signed "shipped minus invoiced" differences. */
  signedQty: string;
  signedAmount: string;
}

const tableRow = { shipments: "发货表", invoices: "发票表" } as const;

export const zhCNRecon = {
  roles: {
    heading: "这个演示里谁做什么",
    code: {
      label: "代码",
      text: "校验字段、去重、按发货单号匹配、合计多张发票、计算差异。结果可复算。",
    },
    agent: {
      label: "模拟 Agent",
      text: "按固定规则读取代码结果，解释异常并引用来源行。不改数字，不做决定。",
    },
    human: {
      label: "人工复核",
      text: "逐条查看异常、写备注、决定如何处理；能确定时修正来源数据，并确认报告已复核。",
    },
  },
  stages: {
    data: "载入样例数据",
    reconcile: "校验与对账",
    agent: "Agent 异常说明",
    review: "人工复核",
    rerun: "修正后复算",
    export: "导出报告",
  },
  stageOf: (i: number, n: number) => `第 ${i} / ${n} 步`,
  leads: {
    data: "下面是两张内置的虚构样例表。先看一遍原始数据，再运行对账。",
    reconcile: "以下结果全部由代码按固定规则计算：先校验，再匹配，最后算差异。",
    agent: "模拟 Agent 根据上一步的对账结果生成异常说明。它只解释，不重算，也不替你决定。",
    review: "逐条打开异常，查看来源行和 Agent 说明，写备注、做决定；能确定的可以直接修正来源数据。",
    rerun: "代码把你的修正应用到样例数据的副本上，再按同样的规则对账一次。",
    export: "导出包含对账结果、来源行、异常状态、复核备注和人工修正的 CSV。",
  },
  next: {
    data: "运行校验与对账",
    reconcile: "生成 Agent 异常说明",
    agent: "进入人工复核",
    review: "查看修正后复算",
    rerun: "前往导出",
  },
  back: "上一步",
  restart: "重新开始",
  fix: zhCNReconFix,
  tables: {
    shipments: "发货记录（样例，虚构）",
    invoices: "发票记录（样例，虚构）",
    row: "来源行",
    shipmentId: "发货单号",
    invoiceId: "发票号",
    customer: "客户",
    sku: "物料",
    quantity: "数量",
    amount: "金额（元）",
    missing: "缺失",
    rowCount: (n: number) => `${n} 行`,
  },
  fields: {
    shipmentId: "发货单号",
    invoiceId: "发票号",
    customer: "客户",
    sku: "物料",
    quantity: "数量",
    amountCents: "金额",
  },
  problems: { missing: "缺失", invalid: "格式不正确" },
  ref: (table: keyof typeof tableRow, row: number) => `${tableRow[table]}第 ${row} 行`,
  duplicateMark: "（重复，未计入）",
  checks: {
    heading: "代码完成的检查",
    items: [
      "必填字段校验：发货单号、客户、物料、数量、金额；发票号、发货单号、数量、金额。",
      "去重：同一编号且内容完全相同的行只计入一次；内容不同则标记冲突，交给人工。",
      "匹配：按发货单号把发票挂到发货记录上；同一发货单的多张发票合计后比较。",
      "差异：差异 = 发货 − 开票，正数表示仍未开票。缺少数据时不推算。",
    ],
  },
  results: {
    caption: "对账结果（代码计算）",
    shipmentId: "发货单号",
    status: "结果",
    shippedQty: "发货数量",
    invoicedQty: "开票数量",
    qtyDiff: "数量差",
    shippedAmount: "发货金额",
    invoicedAmount: "开票金额",
    amountDiff: "金额差",
    invoices: "发票",
    refs: "来源行",
    exceptions: "异常",
    none: "—",
    summary: (lines: number, matched: number, exceptions: number) =>
      `共 ${lines} 条对账结果，${matched} 条完全匹配，发现 ${exceptions} 个异常。`,
  },
  lineStatus: {
    matched: "已匹配",
    difference: "有差异",
    "needs-review": "需人工判断",
    incomplete: "数据缺失",
    "not-invoiced": "未开票",
    "unmatched-invoice": "发票无对应发货",
  },
  kinds: {
    "conflicting-rows": "同号记录冲突",
    "missing-field": "必填字段缺失",
    "unmatched-invoice": "发票无对应发货",
    "amount-difference": "数量或金额差异",
    "not-invoiced": "已发货未开票",
    "duplicate-row": "重复记录",
  },
  severity: { high: "高", medium: "中", low: "低" },
  severityLabel: (s: string) => `优先级：${s}`,
  agent: {
    badge: "模拟 Agent · 固定规则生成",
    disclaimer: "以下文字由固定模板根据代码结果生成，没有调用任何模型。",
    headline: (
      lines: number,
      matched: number,
      exceptions: number,
      h: number,
      m: number,
      l: number,
    ) =>
      `本次对账共 ${lines} 条结果：${matched} 条完全匹配，${exceptions} 个异常（高 ${h}、中 ${m}、低 ${l}）。` +
      "我按优先级列出每个异常和建议的下一步，最终处理由复核人决定。",
    suggestionLabel: "建议",
    notes: {
      "pick-source-of-truth": (p: ReconNoteParams) =>
        `${p.shipment} 有编号相同但内容不一致的记录，代码无法判断哪一行正确，因此没有计算差异。` +
        `相关发票：${p.invoices || "无"}。来源：${p.refs}。`,
      "fill-missing-field": (p: ReconNoteParams) =>
        `${p.shipment || "该记录"} 缺少必填字段：${p.fields}。缺数据时代码不推算，也不计算差异。` +
        `相关发票：${p.invoices || "无"}。来源：${p.refs}。`,
      "trace-invoice": (p: ReconNoteParams) =>
        `发票 ${p.invoices} 引用的发货单号 ${p.shipment || "（空）"} 在发货表中不存在。` +
        `来源：${p.refs}。`,
      "follow-up-invoicing": (p: ReconNoteParams) =>
        `${p.shipment} 的发票 ${p.invoices} 合计后，仍有 ${p.qty} 件、¥${p.amount} 未开票。` +
        `来源：${p.refs}。`,
      "check-over-invoicing": (p: ReconNoteParams) =>
        `${p.shipment} 的发票 ${p.invoices} 合计超出发货 ${p.qty} 件、¥${p.amount}。` +
        `来源：${p.refs}。`,
      "check-price-or-quantity": (p: ReconNoteParams) =>
        `${p.shipment} 的数量差（${p.signedQty}）与金额差（¥${p.signedAmount}）方向不一致，` +
        `可能是单价或数量录入错误。来源：${p.refs}。`,
      "issue-invoice": (p: ReconNoteParams) =>
        `${p.shipment} 已发货，但没有任何发票。来源：${p.refs}。`,
      "confirm-duplicate": (p: ReconNoteParams) =>
        `${p.shipment} 的发货记录有完全相同的重复行，代码只计入一次，未重复计算数量和金额；` +
        `发票 ${p.invoices || "（无）"} 合计后与计入的那一行比较。来源：${p.refs}。`,
    },
    suggestions: {
      "pick-source-of-truth": "请业务人员核对原始单据，确定以哪一行为准后重新对账。",
      "fill-missing-field": "请数据提供方补录缺失字段后重新对账。",
      "trace-invoice": "核对发货单号是否录错，或发货记录是否漏导入。",
      "follow-up-invoicing": "确认是否为分批开票，并跟进剩余部分的发票。",
      "check-over-invoicing": "核对是否重复开票或开错发货单。",
      "check-price-or-quantity": "核对发货与发票上的单价和数量。",
      "issue-invoice": "确认这笔发货是否需要开票。",
      "confirm-duplicate": "确认是重复导入后，在源系统中清理重复行。",
    },
  },
  review: {
    listLabel: "异常列表",
    inspect: "查看 ",
    inspected: "已查看",
    notInspected: "未查看",
    choose: "从左侧选择一个异常开始复核。",
    sourceRows: "引用的来源行",
    agentSays: "Agent 说明",
    decision: "处理决定",
    decisions: { open: "待处理", resolved: "已解决", "follow-up": "转交跟进（未解决）" },
    note: "复核备注",
    noteHint: (max: number) => `最多 ${max} 字。标记为“已解决”前必须写明理由。`,
    needsNote: "请先写备注，再标记为“已解决”。",
    progress: (inspected: number, total: number) => `已查看 ${inspected} / ${total} 个异常`,
    confirm: "确认报告已复核",
    confirmed: "报告已确认复核。备注与决定已锁定。",
    reopen: "撤销确认，继续修改",
    unresolved: (n: number) => `仍有 ${n} 个异常未解决，它们会以“未解决”状态保留在报告中。`,
    allResolved: "所有异常都已解决。",
    errors: {
      "inspect-all": "请逐条查看所有异常后再确认。",
      "confirm-review": "请确认报告已复核。",
    },
  },
  export: {
    download: "下载 CSV",
    preview: "CSV 预览（复核相关列）",
    rows: (n: number, cols: number) => `${n} 行数据 × ${cols} 列（不含表头）。`,
    done: "完成！代码算清了数字，Agent 解释了异常，你做出了处理决定。",
    yes: "是",
    no: "否",
    headers: [
      "发货单号",
      "对账结果",
      "发货数量",
      "开票数量",
      "数量差（发货−开票）",
      "发货金额（元）",
      "开票金额（元）",
      "金额差（元，发货−开票）",
      "发票号",
      "来源行",
      "异常编号",
      "异常类型",
      "优先级",
      "异常来源行",
      "异常状态",
      "复核备注",
      "人工修正",
      "修正后结果",
      "报告已复核",
    ],
  },
} as const;
