import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { t } from "@/i18n";
import { FlowBuilderLab } from "./FlowBuilderLab";

const s = t.labs.flow;

describe("FlowBuilderLab", () => {
  it("starts incomplete and becomes complete once every requirement is met", async () => {
    const user = userEvent.setup();
    render(<FlowBuilderLab />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(s.incomplete);
    expect(status).toHaveTextContent(s.issues["verification-needs-review"]);

    const exceptions = screen.getAllByLabelText(s.fields.exceptionPath);
    const sources = screen.getAllByLabelText(s.fields.dataSource);
    for (const input of exceptions) await user.type(input, "转人工");
    for (const input of sources.slice(1)) await user.type(input, "系统");
    await user.selectOptions(
      screen.getAllByLabelText(s.fields.owner)[2] as HTMLElement,
      "reviewer",
    );

    const third = screen.getAllByRole("group")[2] as HTMLElement;
    const review = within(third).getByRole("checkbox", { name: s.fields.humanReview });
    review.focus();
    await user.keyboard(" ");

    expect(status).toHaveTextContent(s.complete);
    expect(screen.getByText(t.labs.score(100))).toBeInTheDocument();
  });

  it("adds and removes steps with buttons", async () => {
    const user = userEvent.setup();
    render(<FlowBuilderLab />);
    await user.click(screen.getByRole("button", { name: s.add }));
    expect(screen.getAllByRole("group")).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: `${s.remove}${s.step(4)}` }));
    expect(screen.getAllByRole("group")).toHaveLength(3);
  });
});
