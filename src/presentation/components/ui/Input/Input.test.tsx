import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";

describe("Input Component", () => {
  it("should render the label in uppercase and tracking wide", () => {
    render(<Input type="text" label="Nombre del Servidor" />);
    const label = screen.getByText(/nombre del servidor/i);
    expect(label).toHaveClass("uppercase");
  });

  it("should block non-numeric input when type is number", () => {
    render(<Input type="number" placeholder="test-input" />);
    const input = screen.getByPlaceholderText("test-input") as HTMLInputElement;
    const event = new CustomEvent("beforeinput", { cancelable: true }) as any;
    event.data = "A";
    expect(input.pattern).toBe("[0-9]*");
  });

  it("should show error message and red border when error prop is present", () => {
    render(<Input type="text" error="Campo requerido" />);
    const errorMessage = screen.getByText(/campo requerido/i);
    expect(errorMessage).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("border-red-900/50");
  });
});
