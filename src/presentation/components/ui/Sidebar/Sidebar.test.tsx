import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar Component", () => {
  const mockUser = {
    name: "Alan Martinez",
    role: "Super Administrador",
    email: "alan@neuropoint.ai",
    organization: "Neuropoint AI",
  };

  const mockOnLogout = vi.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  it("debe renderizar el nombre del usuario correctamente", () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });

  it("debe mostrar el menú de usuario detallado al hacer clic en el perfil y NO estar colapsado", () => {
    render(<Sidebar user={mockUser} onLogout={mockOnLogout} />);

    const profileTrigger = screen.getByText(mockUser.name).closest("button");
    expect(profileTrigger).toBeDefined();

    if (profileTrigger) {
      fireEvent.click(profileTrigger);
    }

    expect(screen.getByText(mockUser.role)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it("debe llamar a la función onLogout cuando se hace clic en el botón de cerrar sesión", () => {
    render(<Sidebar user={mockUser} onLogout={mockOnLogout} />);

    const profileTrigger = screen.getByText(mockUser.name).closest("button");
    if (profileTrigger) {
      fireEvent.click(profileTrigger);
    }

    const logoutButton = screen.getByText(/Cerrar Sesión/i);
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

  it("no debe mostrar el menú de usuario cuando el sidebar está colapsado", () => {
    const { container } = render(<Sidebar user={mockUser} />);

    const toggleButton = screen.getByRole("button", {
      name: /colapsar sidebar/i,
    });
    fireEvent.click(toggleButton);

    const avatarButton = container.querySelector(".justify-center button");
    if (avatarButton) {
      fireEvent.click(avatarButton);
    }

    expect(screen.queryByText(mockUser.role)).not.toBeInTheDocument();
    expect(screen.queryByText(mockUser.email)).not.toBeInTheDocument();
  });

  it("debe mostrar los items del menú según el rol del usuario", () => {
    const adminUser = {
      ...mockUser,
      role: "admin",
    };

    render(<Sidebar user={adminUser} />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it("debe navegar al hacer clic en un item del menú", () => {
    delete (window as any).location;
    (window as any).location = { href: "" };

    render(<Sidebar user={mockUser} />);

    const dashboardLink = screen.getByText(/Dashboard/i).closest("button");
    expect(dashboardLink).toBeDefined();

    if (dashboardLink) {
      fireEvent.click(dashboardLink);
      expect(window.location.href).toContain("/dashboard/super_admin");
    }
  });

  it("debe aplicar la clase activa al item del menú que coincide con la ruta actual", () => {
    const originalPathname = window.location.pathname;
    Object.defineProperty(window, "location", {
      value: { pathname: "/dashboard/super_admin" },
      writable: true,
    });

    render(<Sidebar user={mockUser} />);

    const activeItem = screen.getByText(/Dashboard/i).closest("button");
    expect(activeItem).toHaveClass("bg-blue-primary/20");
    expect(activeItem).toHaveClass("text-blue-glow");

    Object.defineProperty(window, "location", {
      value: { pathname: originalPathname },
      writable: true,
    });
  });
});
