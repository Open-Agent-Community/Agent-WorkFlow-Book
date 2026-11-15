/** zh-CN strings for choosing the data of the 发货对账 Agent lab (`labs.recon.data`). */
export const zhCNReconData = {
  legend: "选择数据",
  sources: {
    basic: "基础样例：匹配、重复、冲突、部分开票、缺失、无对应发货",
    advanced: "进阶样例：未开票、超额开票、单价不符、重复发票、金额无效",
    custom: "粘贴自己的 CSV",
  },
  current: (label: string) => `当前数据：${label}`,
  customLabel: "自定义 CSV",
  switchNote: "切换数据会从第 1 步重新开始，之前的复核与修正不会保留。",
  privacy:
    "数据只在你的浏览器里解析和计算，不会上传。请使用虚构或已脱敏的数据，不要粘贴真实的客户、财务或个人信息。",
  shipmentsLabel: "发货记录 CSV",
  invoicesLabel: "发票记录 CSV",
  columnsHint: (cols: string) => `第一行是表头，需包含：${cols}。金额单位为元，最多两位小数。`,
  limits: (rows: number, chars: number) => `每张表最多 ${rows} 行、${chars} 个字符。`,
  load: "载入并校验",
  loadTemplate: "填入当前数据作为模板",
  loaded: (s: number, i: number) => `已载入发货 ${s} 行、发票 ${i} 行。`,
  errorIn: (table: string, message: string) => `${table}：${message}`,
  errors: {
    empty: "没有数据行。",
    "too-long": "内容过长。",
    "too-many-rows": "行数超出上限。",
    "unclosed-quote": "有未闭合的引号。",
    "missing-columns": (cols: string) => `缺少表头列：${cols}。`,
  },
  columns: {
    shipmentId: "发货单号",
    invoiceId: "发票号",
    customer: "客户",
    sku: "物料",
    quantity: "数量",
    amount: "金额（元）",
  },
  invalid: "格式不正确",
} as const;
