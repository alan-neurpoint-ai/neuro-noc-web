import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "../../../../core/presentation/components/ui/Input";

describe("Input Component - Atomic UI & Regex Validation", () => {
  it("debe aplicar el radio de esquina de 20px solicitado", () => {
    render(<Input placeholder="Geometría" />);
    const input = screen.getByPlaceholderText("Geometría");
    expect(input).toHaveClass("rounded-[15px]");
  });

  it("debe validar y permitir solo números cuando validationType es numeric", () => {
    const handleChange = vi.fn();
    render(
      <Input
        validationType="numeric"
        onChange={handleChange}
        placeholder="Solo números"
      />,
    );
    const input = screen.getByPlaceholderText("Solo números");
    fireEvent.change(input, { target: { value: "abc" } });
    expect(handleChange).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: "123" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('debe permitir prefijos telefónicos como "+52"', () => {
    const handleChange = vi.fn();
    render(
      <Input
        validationType="phonePrefix"
        onChange={handleChange}
        placeholder="+1"
      />,
    );
    const input = screen.getByPlaceholderText("+1");
    fireEvent.change(input, { target: { value: "+52" } });
    expect(handleChange).toHaveBeenCalled();
    fireEvent.change(input, { target: { value: "+52a" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("debe validar decimales correctamente", () => {
    const handleChange = vi.fn();
    render(
      <Input
        validationType="decimal"
        onChange={handleChange}
        placeholder="0.00"
      />,
    );
    const input = screen.getByPlaceholderText("0.00");
    fireEvent.change(input, { target: { value: "10.50" } });
    expect(handleChange).toHaveBeenCalled();
    fireEvent.change(input, { target: { value: "10.50.2" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("debe mostrar estilos de error y el mensaje correspondiente", () => {
    render(<Input error="Error crítico" />);
    expect(screen.getByText(/error crítico/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("border-status-error");
  });

  it("debe cambiar el color del icono al hacer foco (Foco de Contraste)", () => {
    render(<Input icon={<span data-testid="icon">📧</span>} />);
    const iconContainer = screen.getByTestId("icon").parentElement;
    expect(iconContainer).toHaveClass("group-focus-within:text-brand-accent");
  });

  it("debe renderizar como datetime-local cuando el tipo es especificado", () => {
    render(<Input type="datetime-local" data-testid="date-input" />);
    const input = screen.getByTestId("date-input");
    expect(input).toHaveAttribute("type", "datetime-local");
  });
});
