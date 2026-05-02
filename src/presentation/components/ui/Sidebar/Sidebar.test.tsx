import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar Component", () => {
  const mockUser = {
    name: "Alan",
    role: "Ingeniero de Prompts Senior",
    email: "alan@neuropoint.ai",
    organization: "Neuropoint AI",
  };

  const mockOnLogout = vi.fn();

  it("debe renderizar el nombre y la organización del usuario correctamente", () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.organization)).toBeInTheDocument();
  });

  it("debe mostrar el menú de usuario detallado al hacer clic en el perfil y NO estar colapsado", () => {
    render(<Sidebar user={mockUser} onLogout={mockOnLogout} />);
    const profileTrigger = screen.getByText(mockUser.name).closest("button");
    if (profileTrigger) fireEvent.click(profileTrigger);
    expect(screen.getByText(mockUser.role)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it("debe llamar a la función onLogout cuando se hace clic en el botón de cerrar sesión", () => {
    render(<Sidebar user={mockUser} onLogout={mockOnLogout} />);
    const profileTrigger = screen.getByText(mockUser.name).closest("button");
    if (profileTrigger) fireEvent.click(profileTrigger);
    const logoutButton = screen.getByText(/cerrar sesión/i);
    fireEvent.click(logoutButton);
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it("debe alternar entre estado colapsado y expandido al hacer clic en el botón de toggle", () => {
    const { container } = render(<Sidebar user={mockUser} />);
    const aside = container.querySelector("aside");
    const toggleButton = screen.getByRole("button", {
      name: /colapsar sidebar/i,
    });
    expect(aside).toHaveClass("w-64");
    fireEvent.click(toggleButton);
    expect(aside).toHaveClass("w-20");
    expect(
      screen.getByRole("button", { name: /expandir sidebar/i }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /expandir sidebar/i }));
    expect(aside).toHaveClass("w-64");
  });
});
