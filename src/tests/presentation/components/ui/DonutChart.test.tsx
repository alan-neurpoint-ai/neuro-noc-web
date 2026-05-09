import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  DonutChart,
  type PieData,
} from "../../../../core/presentation/components/ui/DonutChart";

const mockPieData: PieData[] = [
  { label: "Critical", value: 40, strokeDasharray: "", strokeDashoffset: 0 },
  { label: "Warning", value: 60, strokeDasharray: "", strokeDashoffset: 0 },
];

describe("DonutChart Component", () => {
  it("debe renderizar el título y el total inicial", () => {
    render(<DonutChart data={mockPieData} title="SYSTEM STATUS" />);

    expect(screen.getByText(/SYSTEM STATUS/i)).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("debe calcular correctamente los porcentajes de los segmentos", () => {
    const { container } = render(<DonutChart data={mockPieData} />);
    const circles = container.querySelectorAll("circle");
    expect(circles[0]).toHaveAttribute("stroke-dasharray", "40 100");
    expect(circles[1]).toHaveAttribute("stroke-dasharray", "60 100");
  });

  it("debe actualizar el centro y resaltar la leyenda al hacer hover en un segmento", () => {
    const { container } = render(<DonutChart data={mockPieData} />);
    const firstCircle = container.querySelector("circle");
    if (!firstCircle) throw new Error("SVG Circle no encontrado");
    fireEvent.mouseEnter(firstCircle);
    expect(screen.getAllByText(/CRITICAL/i).length).toBeGreaterThan(0);
    expect(screen.getByText("40.0%")).toBeInTheDocument();
    fireEvent.mouseLeave(firstCircle);
    expect(screen.getAllByText(/TOTAL/i).length).toBeGreaterThan(0);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("debe aplicar opacidad reducida a los items de la leyenda no activos", () => {
    render(<DonutChart data={mockPieData} />);
    const legendItems = screen
      .getAllByText(/Critical|Warning/i)
      .map((el) => el.closest('div[class*="transition-opacity"]'));

    fireEvent.mouseEnter(legendItems[0]!);
    expect(legendItems[1]).toHaveClass("opacity-30");
    expect(legendItems[0]).toHaveClass("opacity-100");
  });

  it("debe retornar null si no hay datos (Poda semántica de renderizado)", () => {
    const { container } = render(<DonutChart data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("debe usar los colores proporcionados en la data", () => {
    const customData = [
      {
        label: "Custom",
        value: 100,
        color: "#FF5500",
        strokeDasharray: "",
        strokeDashoffset: 0,
      },
    ];
    const { container } = render(<DonutChart data={customData} />);
    const circle = container.querySelector("circle");

    expect(circle).toHaveAttribute("stroke", "#FF5500");
  });
});
