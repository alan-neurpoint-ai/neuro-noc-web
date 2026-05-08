import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../../../../core/presentation/components/ui/Button";

describe("Button Component - Atomic UI", () => {
  it("debe aplicar el radio de esquina de 10px definido en Figma", () => {
    const { container } = render(<Button>Geometric Test</Button>);
    expect(container.firstChild).toHaveClass("rounded-[10px]");
  });

  it("debe utilizar la fuente técnica del sistema (font-headline)", () => {
    const { container } = render(<Button>Typography Test</Button>);
    expect(container.firstChild).toHaveClass("font-headline");
  });

  it("debe aplicar el contraste correcto para la variante login (brand-primary)", () => {
    const { container } = render(<Button variant="login">Login</Button>);
    expect(container.firstChild).toHaveClass("bg-brand-primary");
    expect(container.firstChild).toHaveClass("text-white");
  });

  it("debe aplicar el contraste de alta visibilidad para la variante action (brand-accent)", () => {
    const { container } = render(<Button variant="action">CTA</Button>);
    expect(container.firstChild).toHaveClass("bg-brand-accent");
    expect(container.firstChild).toHaveClass("text-bg-surface");
  });

  it("debe ejecutar la función onClick correctamente", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText(/click/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("debe mostrar el estado de carga y deshabilitar la interacción", () => {
    render(<Button isLoading>Action</Button>);
    expect(screen.getByText(/procesando/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("debe ser responsivo al ancho completo mediante la prop fullWidth", () => {
    const { container } = render(<Button fullWidth>Full</Button>);
    expect(container.firstChild).toHaveClass("w-full");
  });
});
