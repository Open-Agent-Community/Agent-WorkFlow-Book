import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { t } from "@/i18n";
import { ShipmentReconciliationLab } from "./ShipmentReconciliationLab";

const r = t.labs.recon;
const f = r.fix;

describe("ShipmentReconciliationLab", () => {
  it("runs from sample data to a reviewed CSV export", async () => {
    const user = userEvent.setup();
    render(<ShipmentReconciliationLab />);

    // 1. Both source tables are visible before anything runs.
    expect(screen.getByRole("table", { name: r.tables.shipments })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: r.tables.invoices })).toBeInTheDocument();
    expect(screen.getAllByText(r.roles.agent.label).length).toBeGreaterThan(0);

    // 2. Code reconciles.
    await user.click(screen.getByRole("button", { name: r.next.data }));
    const results = screen.getByRole("table", { name: r.results.caption });
    expect(within(results).getAllByRole("row")).toHaveLength(1 + 6);
    expect(screen.getByRole("status")).toHaveTextContent(r.results.summary(6, 2, 5));

    // 3. The simulated Agent explains, citing ids and rows.
    await user.click(screen.getByRole("button", { name: r.next.reconcile }));
    expect(screen.getByText(r.agent.badge)).toBeInTheDocument();
    expect(screen.getByText(/SH-1004 的发票 INV-2005 合计后，仍有 120 件/)).toBeInTheDocument();

    // 4. The reviewer inspects every exception before confirming.
    await user.click(screen.getByRole("button", { name: r.next.agent }));
    const confirm = screen.getByRole("button", { name: r.review.confirm });
    expect(confirm).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(r.review.errors["inspect-all"]);

    await user.click(
      screen.getByRole("button", { name: new RegExp(`${r.review.inspect.trim()}\\s*EX-03`) }),
    );
    const resolved = screen.getByLabelText(r.review.decisions.resolved);
    expect(resolved).toBeDisabled();
    await user.type(screen.getByLabelText(r.review.note), "第二批发票下周开具");
    await user.click(screen.getByLabelText(r.review.decisions["follow-up"]));

    const open = (id: string) =>
      user.click(
        screen.getByRole("button", { name: new RegExp(`${r.review.inspect.trim()}\\s*${id}`) }),
      );
    // The reviewer corrects two exceptions; code recomputes each line at once.
    await open("EX-02");
    await user.click(screen.getByLabelText(f.keepRow(r.ref("shipments", 5))));
    expect(screen.getByText(f.text["keep-row"](r.ref("shipments", 5)))).toBeInTheDocument();
    await open("EX-04");
    const qty = screen.getByLabelText(f.fillLabel(r.fields.quantity, r.ref("shipments", 8)));
    await user.type(qty, "4.5");
    await user.click(screen.getByRole("button", { name: f.apply }));
    expect(screen.getByText(new RegExp(f.invalid))).toBeInTheDocument();
    await user.clear(qty);
    await user.type(qty, "40");
    await user.click(screen.getByRole("button", { name: f.apply }));
    expect(screen.getByText(f.text["fill-field"]("发货表第 8 行", "数量", "40"))).toBeVisible();
    await open("EX-01");
    expect(screen.getByText(f.none)).toBeInTheDocument();
    await open("EX-05");
    await user.type(screen.getByLabelText(r.review.note), "已联系发票组");
    await user.click(screen.getByLabelText(r.review.decisions.resolved));
    await user.click(confirm);
    expect(screen.getByText(r.review.confirmed)).toBeInTheDocument();
    expect(screen.getAllByText(r.review.unresolved(4)).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(r.review.note)).toBeDisabled();

    // 5. Code re-runs the same rules on the corrected data.
    await user.click(screen.getByRole("button", { name: r.next.review }));
    expect(screen.getByText(f.rerun.summary(2, 5, 3))).toBeInTheDocument();
    const compare = screen.getByRole("table", { name: f.rerun.compareCaption });
    expect(within(compare).getAllByText(f.rerun.changed)).toHaveLength(2);

    // 6. Export keeps statuses, notes and corrections.
    await user.click(screen.getByRole("button", { name: r.next.rerun }));
    const link = screen.getByRole("link", { name: r.export.download });
    expect(link).toHaveAttribute("download", "shipment-reconciliation-report.csv");
    const csv = decodeURIComponent(link.getAttribute("href")?.split(",").slice(1).join(",") ?? "");
    expect(csv).toContain("第二批发票下周开具");
    expect(csv).toContain("转交跟进（未解决）");
    expect(csv).toContain("已联系发票组");
    expect(csv).toContain("INV-2007");
    expect(csv).toContain("以发货表第 5 行为准，忽略同号的其他行,已匹配");
    expect(screen.getByRole("status")).toHaveTextContent(r.export.done);
  });

  it("switches to the advanced sample and imports pasted CSV", async () => {
    const user = userEvent.setup();
    render(<ShipmentReconciliationLab />);
    const d = r.data;

    await user.click(screen.getByLabelText(d.sources.advanced));
    expect(screen.getByText("SH-2001", { selector: "td" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: r.next.data }));
    expect(screen.getByRole("status")).toHaveTextContent(r.results.summary(6, 2, 5));
    await user.click(screen.getByRole("button", { name: r.back }));

    // Custom CSV: a broken header is reported and nothing changes.
    await user.click(screen.getByLabelText(d.sources.custom));
    expect(screen.getByText(d.privacy)).toBeInTheDocument();
    const ship = screen.getByLabelText(d.shipmentsLabel);
    const inv = screen.getByLabelText(d.invoicesLabel);
    expect((ship as HTMLTextAreaElement).value).toContain("SH-2001");
    await user.clear(ship);
    await user.type(ship, "发货单号,数量{enter}SH-1,1");
    await user.click(screen.getByRole("button", { name: d.load }));
    expect(screen.getByText(/缺少表头列：客户、物料、金额（元）/)).toBeInTheDocument();
    expect(screen.getByText("SH-2001", { selector: "td" })).toBeInTheDocument();

    await user.clear(ship);
    await user.type(ship, "发货单号,客户,物料,数量,金额{enter}SH-9,C,S,2,10");
    await user.clear(inv);
    await user.type(inv, "发票号,发货单号,数量,金额{enter}INV-9,SH-9,2,10");
    await user.click(screen.getByRole("button", { name: d.load }));
    expect(screen.getByText(d.loaded(1, 1))).toBeInTheDocument();
    expect(screen.getAllByText("SH-9", { selector: "td" })).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: r.next.data }));
    expect(screen.getByRole("status")).toHaveTextContent(r.results.summary(1, 1, 0));
  });
});
