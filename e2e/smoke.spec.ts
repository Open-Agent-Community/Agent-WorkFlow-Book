import { expect, test } from "@playwright/test";
import { expectNoSeriousA11yViolations } from "./axe";

const pages = [
  "/",
  "/book",
  "/book/chapters/ch01",
  "/reader",
  "/reader/paths/first-workflow",
  "/enterprise/cases/invoice-triage",
  "/campus/syllabus",
  "/enterprise/diagnosis",
  "/resources",
  "/privacy",
  "/verify",
];

for (const path of pages) {
  test(`renders ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });
}

const axePages = [
  "/",
  "/book/chapters/ch04",
  "/reader/labs/flow-builder",
  "/verify/DEMO-2026-A1B2",
];
for (const path of axePages) {
  test(`has no serious a11y violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expectNoSeriousA11yViolations(page);
  });
}

test("has no serious a11y violations in dark mode", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/campus/labs/prompt-structure");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expectNoSeriousA11yViolations(page);
});

test("returns 404 for unknown audiences and absent features", async ({ page }) => {
  for (const path of [
    "/admin",
    "/reader/syllabus",
    "/fde/diagnosis",
    "/reader/cases/invoice-triage",
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
  }
  await expectNoSeriousA11yViolations(page);
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/book");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "跳到主要内容" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator("#main")).toBeFocused();
});

test("planned pages are labelled and noindex", async ({ page }) => {
  await page.goto("/book/chapters/ch13");
  await expect(page.getByText("筹备中").first()).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("labs show the simulation badge and are keyboard operable", async ({ page }) => {
  await page.goto("/reader/labs/quickstart");
  await expect(page.getByText("Simulation / 模拟").first()).toBeVisible();
  const status = page.getByRole("status");

  await page.getByLabel("汇总团队周报").focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "下一步" }).focus();
  await page.keyboard.press("Enter");

  for (const step of ["收集输入", "智能体起草", "人工核对"]) {
    await page.getByLabel(step).focus();
    await page.keyboard.press("Space");
  }
  await page.getByRole("button", { name: "下一步" }).press("Enter");
  await expect(page.getByText("为每个步骤指定责任人。")).toBeVisible();
  await expect(status).toContainText("还有步骤没有指定责任人");
});

test("verify lookup is clearly a demo", async ({ page }) => {
  await page.goto("/verify");
  await expect(page.getByRole("note").first()).toContainText("演示");
  await page.getByLabel("示例编号").fill("demo-2026-a1b2");
  await page.getByLabel("示例编号").press("Enter");
  await expect(page).toHaveURL(/\/verify\/DEMO-2026-A1B2$/);
  await expect(page.getByText("演示数据 · 非真实证书").first()).toBeVisible();
  await page.goto("/verify/DEMO-0000-0000");
  await expect(page.getByRole("status")).toContainText("没有找到");
});

test("theme toggle switches dark mode and persists", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: "切换到深色模式" }).click();
  await expect(html).toHaveClass(/dark/);
  await page.reload();
  await expect(html).toHaveClass(/dark/);
});

test("sitemap and robots are generated from content", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/book/chapters/ch01");
  expect(sitemap).not.toContain("/book/chapters/ch13");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap:");
});
