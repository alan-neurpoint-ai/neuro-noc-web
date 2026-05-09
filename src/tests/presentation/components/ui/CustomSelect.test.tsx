import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  CustomSelect,
  type SelectOption,
} from "../../../../core/presentation/components/ui/CustomSelect";

const mockOptions: SelectOption[] = [
  { value: "opt1", label: "Option 1", description: "First desc" },
  { value: "opt2", label: "Option 2", description: "Second desc" },
];

describe("CustomSelect Component - Enterprise Edition", () => {
  it("debe renderizar label, placeholder y descripción correctamente", () => {
    render(
      <CustomSelect
        options={mockOptions}
        onChange={() => {}}
        label="NOC Selector"
        placeholder="Choose..."
      />,
    );

    expect(screen.getByText(/NOC SELECTOR/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose\.\.\./i)).toBeInTheDocument();
  });

  it("debe abrir el listbox y mostrar las descripciones al hacer clic", () => {
    render(<CustomSelect options={mockOptions} onChange={() => {}} />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("First desc")).toBeInTheDocument();
  });

  it("debe respetar el estado disabled y no abrir el menú", () => {
    render(<CustomSelect options={mockOptions} onChange={() => {}} disabled />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toBeDisabled();
  });

  it("debe navegar por opciones usando el teclado (ArrowDown y Enter)", () => {
    const onChange = vi.fn();
    render(<CustomSelect options={mockOptions} onChange={onChange} />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger); // Abrimos

    fireEvent.keyDown(document, { key: "ArrowDown" });
    fireEvent.keyDown(document, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith("opt2");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("debe cerrar el menú al presionar la tecla Escape", () => {
    render(<CustomSelect options={mockOptions} onChange={() => {}} />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("debe cerrar el menú al hacer clic fuera del componente", () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <CustomSelect options={mockOptions} onChange={() => {}} />
      </div>,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // Simular clic fuera
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
