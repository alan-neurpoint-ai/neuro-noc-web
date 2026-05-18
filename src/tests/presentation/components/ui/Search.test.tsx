import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Search } from "../../../../core/presentation/components/ui/Search";

describe("Search Component - Atomic UI", () => {
  it("debe emitir el valor de búsqueda al escribir", () => {
    const handleSearch = vi.fn();
    render(<Search onSearch={handleSearch} />);
    const input = screen.getByPlaceholderText(/buscar/i);

    fireEvent.change(input, { target: { value: "Nodo-01" } });
    expect(handleSearch).toHaveBeenCalledWith("Nodo-01");
  });

  it("debe limpiar el campo y emitir string vacío al presionar el botón X", () => {
    const handleSearch = vi.fn();
    render(<Search onSearch={handleSearch} />);
    const input = screen.getByPlaceholderText(/buscar/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Borrar esto" } });
    const clearButton = screen.getByTitle(/limpiar/i);

    fireEvent.click(clearButton);
    expect(input.value).toBe("");
    expect(handleSearch).toHaveBeenLastCalledWith("");
  });

  it("debe mostrar el spinner cuando isLoading es true", () => {
    const { container } = render(<Search onSearch={() => {}} isLoading />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("debe mantener la coherencia geométrica de 20px", () => {
    render(<Search onSearch={() => {}} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("rounded-[15px]");
  });
});
