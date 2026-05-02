import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "./Card";

describe("Card Component", () => {
  it("should render title and value correctly", () => {
    render(<Card title="CPU Usage" value="45%" />);
    expect(screen.getByText(/CPU USAGE/i)).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("should show trend with correct color class", () => {
    render(
      <Card
        title="Traffic"
        value="1.2GB"
        trend={{ value: 12, isPositive: true }}
      />,
    );
    const trendLabel = screen.getByText(/12%/);
    expect(trendLabel).toHaveClass("text-emerald-400");
  });

  it("should render status indicator with pulse animation", () => {
    const { container } = render(<Card title="Server" status="online" />);
    const indicator = container.querySelector(".animate-pulse");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass("bg-emerald-500");
  });
});
