import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Pagination } from "../../../../core/presentation/components/ui/Pagination";

describe("Pagination Component - Fixed Step 10", () => {
  it("debe calcular 3 páginas si hay 25 registros (Salto de 10)", () => {
    render(
      <Pagination currentPage={1} totalItems={25} onPageChange={() => {}} />,
    );
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByText("4")).not.toBeInTheDocument();
  });

  it("debe mostrar el indicador de registros correctamente", () => {
    render(
      <Pagination currentPage={1} totalItems={100} onPageChange={() => {}} />,
    );

    const indicator = screen.getByText((_content, element) => {
      const hasText = (node: Element) =>
        node.textContent === "Mostrando 10 de 100 registros";
      const elementHasText = hasText(element as Element);
      const childrenDontHaveText = Array.from(element?.children || []).every(
        (child) => !hasText(child as Element),
      );
      return elementHasText && childrenDontHaveText;
    });

    expect(indicator).toBeInTheDocument();
  });

  it("debe mantener la geometría de 20px en la navegación", () => {
    const { container } = render(
      <Pagination currentPage={1} totalItems={10} onPageChange={() => {}} />,
    );
    const buttons = container.querySelectorAll("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveClass("rounded-[20px]");
    });
  });

  it("debe deshabilitar navegación si totalItems es menor o igual a 10", () => {
    render(
      <Pagination currentPage={1} totalItems={8} onPageChange={() => {}} />,
    );
    const nextBtn = screen.getAllByRole("button")[3];
    expect(nextBtn).toBeDisabled();

  });
});
