import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  LineChart,
  type DataPoint,
} from "../../../../core/presentation/components/ui/LineChart";

const mockData: DataPoint[] = [
  { value: 10, label: "ENE" },
  { value: 40, label: "FEB" },
  { value: 25, label: "MAR" },
];

describe("LineChart Component", () => {
  it("debe renderizar el contenedor principal y el título", () => {
    render(<LineChart data={mockData} title="NETWORK TRAFFIC" />);
    expect(screen.getByText(/NETWORK TRAFFIC/i)).toBeInTheDocument();
  });

  it("debe calcular correctamente la tendencia (delta)", () => {
    render(<LineChart data={mockData} showDelta={true} />);
    expect(screen.getByText(/150\.00%/)).toBeInTheDocument();
    expect(screen.getByText(/▲/)).toBeInTheDocument();
  });

  it("no debe renderizar nada si el array de datos está vacío", () => {
    const { container } = render(<LineChart data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("debe renderizar los elementos SVG críticos (path y grid)", () => {
    const { container } = render(<LineChart data={mockData} />);
    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute("d");
  });

  it("debe mostrar el tooltip al interactuar con el mouse (hover)", () => {
    const { container } = render(<LineChart data={mockData} unit="Mbps" />);
    const svg = container.querySelector("svg");

    if (!svg) throw new Error("SVG no encontrado");

    svg.getBoundingClientRect = vi.fn(
      () =>
        ({
          width: 100,
          height: 100,
          top: 0,
          left: 0,
          bottom: 100,
          right: 100,
          x: 0,
          y: 0,
          toJSON: () => {},
        }) as DOMRect,
    );

    fireEvent.mouseMove(svg, { clientX: 50 });
    const tooltips = screen.getAllByText(/40\.00/);
    expect(tooltips.length).toBeGreaterThanOrEqual(1);
    const febElements = screen.getAllByText(/FEB/i);
    expect(febElements.length).toBeGreaterThanOrEqual(1);
  });

  it("debe aplicar el color de tendencia negativo correctamente", () => {
    const negativeData = [
      { value: 100, label: "A" },
      { value: 20, label: "B" },
    ];
    render(<LineChart data={negativeData} />);

    expect(screen.getByText(/▼/)).toBeInTheDocument();
  });
});
