import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { t } from "@/i18n";
import { QuickstartLab } from "./QuickstartLab";

const s = t.labs.quickstart;

describe("QuickstartLab", () => {
  it("can be completed end to end", async () => {
    const user = userEvent.setup();
    render(<QuickstartLab />);
    const next = () => screen.getByRole("button", { name: s.next });

    expect(next()).toBeDisabled();
    await user.click(screen.getByLabelText(s.tasks["weekly-report"]));
    await user.click(next());

    for (const step of ["collect", "draft", "verify"] as const) {
      await user.click(screen.getByLabelText(s.steps[step]));
    }
    await user.click(next());

    await user.selectOptions(screen.getByLabelText(s.steps.collect), "system");
    await user.selectOptions(screen.getByLabelText(s.steps.draft), "agent");
    await user.selectOptions(screen.getByLabelText(s.steps.verify), "agent");
    await user.click(next());

    await user.click(screen.getByLabelText(new RegExp(s.steps.verify)));
    expect(screen.getByRole("status")).toHaveTextContent(s.errors["review-needs-human"]);
    expect(next()).toBeDisabled();

    await user.click(screen.getByRole("button", { name: s.back }));
    await user.selectOptions(screen.getByLabelText(s.steps.verify), "human");
    await user.click(next());
    await user.click(next());

    expect(screen.getByRole("status")).toHaveTextContent(s.done);
    expect(screen.getByRole("button", { name: s.restart })).toBeInTheDocument();
  });
});
