import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { t } from "@/i18n";
import { ShipmentReconciliationLab } from "./ShipmentReconciliationLab";

const r = t.labs.recon;

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

    for (const id of ["EX-01", "EX-02", "EX-04", "EX-05"]) {
      await user.click(
        screen.getByRole("button", { name: new RegExp(`${r.review.inspect.trim()}\\s*${id}`) }),
      );
    }
    await user.type(screen.getByLabelText(r.review.note), "已联系发票组");
    await user.click(screen.getByLabelText(r.review.decisions.resolved));
    await user.click(confirm);
    expect(screen.getByText(r.review.confirmed)).toBeInTheDocument();
    expect(screen.getAllByText(r.review.unresolved(4)).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(r.review.note)).toBeDisabled();

    // 5. Export keeps statuses and notes.
    await user.click(screen.getByRole("button", { name: r.next.review }));
    const link = screen.getByRole("link", { name: r.export.download });
    expect(link).toHaveAttribute("download", "shipment-reconciliation-report.csv");
    const csv = decodeURIComponent(link.getAttribute("href")?.split(",").slice(1).join(",") ?? "");
    expect(csv).toContain("第二批发票下周开具");
    expect(csv).toContain("转交跟进（未解决）");
    expect(csv).toContain("已联系发票组");
    expect(csv).toContain("INV-2007");
    expect(screen.getByRole("status")).toHaveTextContent(r.export.done);
  });
});
