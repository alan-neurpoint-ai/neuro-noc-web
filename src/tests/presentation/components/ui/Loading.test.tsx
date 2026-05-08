import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Loading } from "../../../../core/presentation/components/ui/Loading";

describe("Loading Component - Flask Lab Design", () => {
  it("debe renderizar el título principal de la marca", () => {
    render(<Loading />);
    expect(screen.getByText("NEURO NOC")).toBeInTheDocument();
  });

  it("debe aplicar el efecto de desenfoque profundo (backdrop-blur-2xl)", () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toHaveClass("backdrop-blur-2xl");
  });

  it("debe contener el SVG del matraz con su máscara de onda", () => {
    const { container } = render(<Loading />);
    const svg = container.querySelector("svg");
    const mask = container.querySelector("mask#flaskMask");

    expect(svg).toBeInTheDocument();
    expect(mask).toBeInTheDocument();
  });

  it("debe aplicar la animación de onda al líquido interno", () => {
    const { container } = render(<Loading />);
    const liquid = container.querySelector("rect");
    expect(liquid).toHaveClass("animate-[wave_3s_infinite_linear]");
  });

  it("debe mostrar el mensaje de proceso técnico dinámico", () => {
    render(<Loading message="Sincronizando Nodos..." />);
    expect(screen.getByText(/sincronizando nodos/i)).toBeInTheDocument();
    expect(screen.getByText(/procesando.../i)).toBeInTheDocument();
  });

  it("debe renderizar la barra de progreso con animación", () => {
    const { container } = render(<Loading />);
    const progressBar = container.querySelector(
      ".animate-\\[progress_2s_infinite_ease-in-out\\]",
    );
    expect(progressBar).toBeInTheDocument();
  });

  it("debe incluir las burbujas decorativas con animación de flotación", () => {
    const { container } = render(<Loading />);
    const bubbles = container.querySelectorAll(
      'circle[class*="animate-[float"]',
    );
    expect(bubbles.length).toBe(3);
  });
});
