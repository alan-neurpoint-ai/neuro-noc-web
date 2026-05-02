import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button Component", () => {
  it("should render the correct label based on variant", () => {
    render(<Button variant="success" />);
    expect(screen.getByText(/confirmar/i)).toBeInTheDocument();
  });

  it("should override default label when children are provided", () => {
    render(<Button variant="delete">Borrar Nodo</Button>);
    expect(screen.getByText(/borrar nodo/i)).toBeInTheDocument();
    expect(screen.queryByText(/^eliminar$/i)).not.toBeInTheDocument();
  });

  it("should call onClick function when clicked", () => {
    const handleClick = vi.fn();
    render(<Button variant="login" onClick={handleClick} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when the disabled prop is true", () => {
    render(<Button variant="edit" disabled />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-40");
  });

  it("should render the icon associated with the variant", () => {
    const { container } = render(<Button variant="logout" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should apply responsive classes by default", () => {
    render(<Button variant="cancel" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("sm:w-auto");
  });
});
