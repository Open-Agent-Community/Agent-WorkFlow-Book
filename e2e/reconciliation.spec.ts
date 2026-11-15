import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { expectNoSeriousA11yViolations } from "./axe";

test("发货对账 Agent: reachable from the enterprise path, reviewable and exportable", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("main").getByRole("link", { name: "企业版" }).click();
  await page.getByRole("link", { name: "试点准备" }).click();
  await expect(page).toHaveURL(/\/enterprise\/paths\/pilot-readiness$/);
  await page.getByRole("link", { name: "发货对账 Agent" }).click();
  await expect(page).toHaveURL(/\/enterprise\/labs\/shipment-reconciliation$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("发货对账 Agent");
  await expect(page.getByText("Simulation / 模拟").first()).toBeVisible();

  // 1. Sample tables before running.
  await expect(page.getByRole("table", { name: "发货记录（样例，虚构）" })).toBeVisible();
  await expect(page.getByRole("table", { name: "发票记录（样例，虚构）" })).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  // 2–3. Code reconciles, then the simulated Agent explains.
  await page.getByRole("button", { name: "运行校验与对账" }).click();
  await expect(page.getByRole("status")).toContainText("2 条完全匹配，发现 5 个异常");
  await page.getByRole("button", { name: "生成 Agent 异常说明" }).click();
  await expect(page.getByText("模拟 Agent · 固定规则生成")).toBeVisible();
  await page.getByRole("button", { name: "进入人工复核" }).click();

  // 4. Review every exception; resolve one with a note, leave the rest open.
  for (const id of ["EX-02", "EX-04", "EX-05", "EX-03", "EX-01"]) {
    await page.getByRole("button", { name: new RegExp(`查看\\s*${id}`) }).click();
  }
  // Correct two exceptions: code recomputes the affected line straight away.
  await page.getByRole("button", { name: /查看\s*EX-02/ }).click();
  await page.getByLabel("以发货表第 5 行为准").check();
  await expect(page.getByText("以发货表第 5 行为准，忽略同号的其他行")).toBeVisible();
  await page.getByRole("button", { name: /查看\s*EX-04/ }).click();
  await page.getByLabel("补录数量（发货表第 8 行）").fill("40");
  await page.getByRole("button", { name: "应用修正" }).click();
  await expect(page.getByText("发货表第 8 行的数量补录为 40")).toBeVisible();
  await expectNoSeriousA11yViolations(page);
  await page.getByRole("button", { name: /查看\s*EX-01/ }).click();
  await expect(page.getByRole("heading", { name: /EX-01/ })).toBeVisible();
  await expect(page.getByText("发货表第 4 行（重复，未计入）").first()).toBeVisible();
  await page.getByLabel("复核备注").fill("确认是重复导入，源系统已清理。");
  await page.getByLabel("已解决").check();
  await expectNoSeriousA11yViolations(page);
  await page.getByRole("button", { name: "确认报告已复核" }).click();
  await expect(page.getByText("仍有 4 个异常未解决").first()).toBeVisible();

  // 5. Code re-runs on the corrected data.
  await page.getByRole("button", { name: "查看修正后复算" }).click();
  await expect(page.getByText("应用 2 项人工修正后重新对账：异常由 5 个变为 3 个。")).toBeVisible();
  await expect(page.getByRole("table", { name: "修正前后对比（代码计算）" })).toBeVisible();
  await expectNoSeriousA11yViolations(page);
  await page.getByRole("button", { name: "前往导出" }).click();

  // 6. Download the CSV and check its contents.
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "下载 CSV" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("shipment-reconciliation-report.csv");
  const path = await download.path();
  const csv = await readFile(path, "utf8");
  expect(csv.charCodeAt(0)).toBe(0xfeff);
  expect(csv).toContain("确认是重复导入，源系统已清理。");
  expect(csv).toContain("SH-1004,有差异,300,180,120,45000.00,27000.00,18000.00");
  expect(csv).toContain("INV-2007");
  expect(csv).toContain("以发货表第 5 行为准，忽略同号的其他行,已匹配");
  expect(csv).toContain("发货表第 8 行的数量补录为 40,已匹配");
  expect(csv.match(/待处理/g)).toHaveLength(4);
});

test("发货对账 Agent review stage has no serious a11y violations in dark mode", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/fde/labs/shipment-reconciliation");
  await expect(page.locator("html")).toHaveClass(/dark/);
  for (const name of ["运行校验与对账", "生成 Agent 异常说明", "进入人工复核"]) {
    await page.getByRole("button", { name }).click();
  }
  await page.getByRole("button", { name: /查看\s*EX-03/ }).click();
  await expectNoSeriousA11yViolations(page);
});
