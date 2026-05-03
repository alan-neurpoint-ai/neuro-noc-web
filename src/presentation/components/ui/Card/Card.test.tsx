import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "./Card";

describe("Card Component", () => {
  it("should render title and value correctly", () => {
    render(<Card title="CPU Usage" value="45%" />);
    expect(screen.getByText(/CPU USAGE/i)).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("should render subtitle when provided", () => {
    render(<Card title="Alertas" subtitle="Últimas 24 horas" value="12" />);
    expect(screen.getByText("Últimas 24 horas")).toBeInTheDocument();
  });

  it("should render icon when provided", () => {
    render(
      <Card
        title="Server"
        value="Online"
        icon={<span data-testid="test-icon">🔧</span>}
      />,
    );
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("should show trend with correct positive color", () => {
    render(
      <Card
        title="Traffic"
        value="1.2GB"
        trend={{ value: 12, isPositive: true }}
      />,
    );

    const trendContainer = screen.getByText(/12%/).closest("div");
    expect(trendContainer).toHaveClass("text-emerald-400");
    expect(screen.getByText("↑")).toBeInTheDocument();
  });

  it("should show trend with correct negative color", () => {
    render(
      <Card
        title="Latency"
        value="250ms"
        trend={{ value: 5, isPositive: false }}
      />,
    );
    const trendContainer = screen.getByText(/5%/).closest("div");
    expect(trendContainer).toHaveClass("text-rose-400");
    expect(screen.getByText("↓")).toBeInTheDocument();
  });

  it("should show trend with custom label", () => {
    render(
      <Card
        title="Revenue"
        value="$10K"
        trend={{ value: 8, isPositive: true, label: "vs上月" }}
      />,
    );
    expect(screen.getByText(/vs上月/i)).toBeInTheDocument();
  });

  it("should render status indicator with correct colors", () => {
    const { container, rerender } = render(
      <Card title="Server" status="online" />,
    );

  
    let indicator = container.querySelector(".animate-pulse");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass("bg-emerald-500");
    expect(screen.getByText("Operativo")).toBeInTheDocument();

  
    rerender(<Card title="Server" status="offline" />);
    indicator = container.querySelector(".animate-pulse");
    expect(indicator).toHaveClass("bg-red-500");
    expect(screen.getByText("Inactivo")).toBeInTheDocument();

    rerender(<Card title="Server" status="warning" />);
    indicator = container.querySelector(".animate-pulse");
    expect(indicator).toHaveClass("bg-amber-500");
    expect(screen.getByText("Advertencia")).toBeInTheDocument();
  });

  it("should apply variant classes correctly", () => {
    const { container, rerender } = render(
      <Card title="Default Card" value="100" variant="default" />,
    );
    expect(container.querySelector(".p-5")).toBeInTheDocument();

    rerender(<Card title="Compact Card" value="100" variant="compact" />);
    expect(container.querySelector(".p-3")).toBeInTheDocument();

    rerender(<Card title="Large Card" value="100" variant="large" />);
    expect(container.querySelector(".p-6")).toBeInTheDocument();
  });

  it("should show loading skeleton when loading prop is true", () => {
    const { container } = render(<Card title="Loading Card" loading={true} />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    expect(screen.queryByText("Loading Card")).not.toBeInTheDocument();
  });

  it("should render children content", () => {
    render(
      <Card title="With Children" value="100">
        <button data-testid="action-button">Ver Detalles</button>
      </Card>,
    );
    expect(screen.getByTestId("action-button")).toBeInTheDocument();
    expect(screen.getByText("Ver Detalles")).toBeInTheDocument();
  });

  it("should render footer content", () => {
    render(
      <Card
        title="With Footer"
        value="500"
        footer={<span data-testid="footer-text">Actualizado hace 5min</span>}
      />,
    );
    expect(screen.getByTestId("footer-text")).toBeInTheDocument();
    expect(screen.getByText("Actualizado hace 5min")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Card title="Custom Class" value="100" className="custom-test-class" />,
    );
    expect(container.querySelector(".custom-test-class")).toBeInTheDocument();
  });

  it("should render all value sizes correctly", () => {
    const { container, rerender } = render(
      <Card title="Default" value="100" variant="default" />,
    );
    expect(container.querySelector(".text-3xl")).toBeInTheDocument();

    rerender(<Card title="Compact" value="100" variant="compact" />);
    expect(container.querySelector(".text-xl")).toBeInTheDocument();

    rerender(<Card title="Large" value="100" variant="large" />);
    expect(container.querySelector(".text-4xl")).toBeInTheDocument();
  });

  it("should handle trend without value", () => {
    render(<Card title="Trend Only" trend={{ value: 10, isPositive: true }} />);
    const trendContainer = screen.getByText(/10%/).closest("div");
    expect(trendContainer).toHaveClass("text-emerald-400");
    expect(screen.getByText("↑")).toBeInTheDocument();
  });

  it("should have hover effects classes", () => {
    const { container } = render(<Card title="Hover Card" value="100" />);
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass("hover:border-accent/30");
    expect(cardElement).toHaveClass("hover:-translate-y-0.5");
  });
});
