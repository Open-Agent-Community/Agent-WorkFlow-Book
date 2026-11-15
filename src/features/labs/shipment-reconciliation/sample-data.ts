/**
 * Fictional sample tables for the shipment reconciliation lab.
 * Companies, items and numbers are invented. Amounts are integer cents to keep arithmetic exact.
 * `row` is the spreadsheet row number in the (imagined) source file; row 1 is the header.
 */

export interface ShipmentRow {
  row: number;
  shipmentId: string;
  customer: string;
  sku: string;
  quantity: number | null;
  amountCents: number | null;
}

export interface InvoiceRow {
  row: number;
  invoiceId: string;
  shipmentId: string;
  quantity: number | null;
  amountCents: number | null;
}

export const SAMPLE_SHIPMENTS: readonly ShipmentRow[] = [
  // Fully matched by one invoice.
  {
    row: 2,
    shipmentId: "SH-1001",
    customer: "示例商贸（虚构）",
    sku: "纸箱 A4",
    quantity: 100,
    amountCents: 5_000_000,
  },
  // Rows 3 and 4 are an exact duplicate: counted once, matched by two invoices.
  {
    row: 3,
    shipmentId: "SH-1002",
    customer: "样例制造（虚构）",
    sku: "托盘 B2",
    quantity: 200,
    amountCents: 3_000_000,
  },
  {
    row: 4,
    shipmentId: "SH-1002",
    customer: "样例制造（虚构）",
    sku: "托盘 B2",
    quantity: 200,
    amountCents: 3_000_000,
  },
  // Rows 5 and 6 share an id but disagree: a person must decide which is right.
  {
    row: 5,
    shipmentId: "SH-1003",
    customer: "演示物流（虚构）",
    sku: "封箱胶带",
    quantity: 50,
    amountCents: 1_000_000,
  },
  {
    row: 6,
    shipmentId: "SH-1003",
    customer: "演示物流（虚构）",
    sku: "封箱胶带",
    quantity: 60,
    amountCents: 1_200_000,
  },
  // Partially invoiced: 120 units and ¥18,000.00 not yet invoiced.
  {
    row: 7,
    shipmentId: "SH-1004",
    customer: "测试零售（虚构）",
    sku: "缓冲气泡膜",
    quantity: 300,
    amountCents: 4_500_000,
  },
  // Quantity is missing, so the difference cannot be calculated.
  {
    row: 8,
    shipmentId: "SH-1005",
    customer: "示例商贸（虚构）",
    sku: "标签纸",
    quantity: null,
    amountCents: 800_000,
  },
];

export const SAMPLE_INVOICES: readonly InvoiceRow[] = [
  { row: 2, invoiceId: "INV-2001", shipmentId: "SH-1001", quantity: 100, amountCents: 5_000_000 },
  { row: 3, invoiceId: "INV-2002", shipmentId: "SH-1002", quantity: 120, amountCents: 1_800_000 },
  { row: 4, invoiceId: "INV-2003", shipmentId: "SH-1002", quantity: 80, amountCents: 1_200_000 },
  { row: 5, invoiceId: "INV-2004", shipmentId: "SH-1003", quantity: 50, amountCents: 1_000_000 },
  { row: 6, invoiceId: "INV-2005", shipmentId: "SH-1004", quantity: 180, amountCents: 2_700_000 },
  { row: 7, invoiceId: "INV-2006", shipmentId: "SH-1005", quantity: 40, amountCents: 800_000 },
  // No shipment SH-1099 exists.
  { row: 8, invoiceId: "INV-2007", shipmentId: "SH-1099", quantity: 10, amountCents: 150_000 },
];

/**
 * A second fictional scenario that exercises the rules the first one does not: a shipment with
 * no invoice, over-invoicing, a price-or-quantity mismatch, a duplicate invoice row and an
 * invalid (negative) amount.
 */
export const ADVANCED_SHIPMENTS: readonly ShipmentRow[] = [
  {
    row: 2,
    shipmentId: "SH-2001",
    customer: "样例电子（虚构）",
    sku: "包装盒 C1",
    quantity: 80,
    amountCents: 1_600_000,
  },
  {
    row: 3,
    shipmentId: "SH-2002",
    customer: "演示家居（虚构）",
    sku: "木托盘",
    quantity: 100,
    amountCents: 2_000_000,
  },
  {
    row: 4,
    shipmentId: "SH-2003",
    customer: "测试食品（虚构）",
    sku: "保温箱",
    quantity: 50,
    amountCents: 500_000,
  },
  {
    row: 5,
    shipmentId: "SH-2004",
    customer: "示例商贸（虚构）",
    sku: "纸箱 A4",
    quantity: 30,
    amountCents: 300_000,
  },
  {
    row: 6,
    shipmentId: "SH-2005",
    customer: "样例制造（虚构）",
    sku: "打包带",
    quantity: 20,
    amountCents: -10_000,
  },
  {
    row: 7,
    shipmentId: "SH-2006",
    customer: "演示物流（虚构）",
    sku: "封箱胶带",
    quantity: 10,
    amountCents: 200_000,
  },
];

export const ADVANCED_INVOICES: readonly InvoiceRow[] = [
  // SH-2001 has no invoice at all.
  { row: 2, invoiceId: "INV-3001", shipmentId: "SH-2002", quantity: 60, amountCents: 1_200_000 },
  { row: 3, invoiceId: "INV-3002", shipmentId: "SH-2002", quantity: 60, amountCents: 1_200_000 },
  // Fewer units but a higher amount than shipped: the signs of the differences disagree.
  { row: 4, invoiceId: "INV-3003", shipmentId: "SH-2003", quantity: 45, amountCents: 550_000 },
  // Rows 5 and 6 are the same invoice imported twice.
  { row: 5, invoiceId: "INV-3004", shipmentId: "SH-2004", quantity: 30, amountCents: 300_000 },
  { row: 6, invoiceId: "INV-3004", shipmentId: "SH-2004", quantity: 30, amountCents: 300_000 },
  { row: 7, invoiceId: "INV-3005", shipmentId: "SH-2005", quantity: 20, amountCents: 100_000 },
  { row: 8, invoiceId: "INV-3006", shipmentId: "SH-2006", quantity: 10, amountCents: 200_000 },
];
