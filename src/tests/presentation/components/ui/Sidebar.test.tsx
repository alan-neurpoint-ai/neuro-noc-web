import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BiHome, BiBell } from "react-icons/bi";
import {
  Sidebar,
  type NavItem as DynamicNavItem,
} from "../../../../core/presentation/components/ui/Sidebar";

const mockNavItems: DynamicNavItem[] = [
  {
    id: "dash",
    label: "Dashboard",
    icon: <BiHome />,
    path: "/dashboard",
    badge: 5,
  },
  { id: "alerts", label: "Alertas", icon: <BiBell />, path: "/alerts" },
];

describe("Sidebar Component - Neuro NOC Premium", () => {
  const defaultProps = {
    navItems: mockNavItems,
    userName: "Alan Martinez",
    userRole: "Senior Engineer",
    userCompany: "NeuroPoint AI",
    onNavigate: vi.fn(),
    onLogout: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✓ Renderizado base: marca e items", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText(/Neuro/i)).toBeInTheDocument();
    expect(screen.getByText(/NOC/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it("✓ Colapso/Expansión: toggle de ancho", () => {
    const { container } = render(<Sidebar {...defaultProps} />);
    const aside = container.querySelector("aside");
    const buttons = screen.getAllByRole("button");
    const toggleBtn = buttons[0];
    expect(aside).toHaveClass("w-64");
    fireEvent.click(toggleBtn);
    expect(aside).toHaveClass("w-20");
  });

  it("✓ Navegación: callback al hacer click", () => {
    render(<Sidebar {...defaultProps} />);
    const dashBtn = screen.getByRole("button", { name: /Dashboard/i });
    fireEvent.click(dashBtn);
    expect(defaultProps.onNavigate).toHaveBeenCalledWith("dash", "/dashboard");
  });

  it("✓ Perfil: apertura de panel y logout", () => {
    render(<Sidebar {...defaultProps} />);
    const profileBtn = screen.getByRole("button", { name: /Alan Martinez/i });
    fireEvent.click(profileBtn);
    expect(screen.getByText(/Cerrar Sesión/i)).toBeInTheDocument();
    const logoutBtn = screen.getByText(/Cerrar Sesión/i);
    fireEvent.click(logoutBtn);
    expect(defaultProps.onLogout).toHaveBeenCalled();
  });

  it("✓ Estilos: item activo", () => {
    render(<Sidebar {...defaultProps} activeId="dash" />);
    const dashBtn = screen.getByRole("button", { name: /Dashboard/i });
    expect(dashBtn).toHaveClass("bg-brand-primary/30");
    expect(dashBtn).toHaveClass("border-brand-accent/20");
  });

  it("✓ Tooltip: visibilidad en hover cuando está colapsado", () => {
    render(<Sidebar {...defaultProps} />);
    const toggleBtn = screen.getAllByRole("button")[0];
    fireEvent.click(toggleBtn);
    const dashBtn = screen.getByRole("button", { name: /Dashboard/i });
    fireEvent.mouseEnter(dashBtn);
    const tooltip = screen.getByText("Dashboard");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip.closest("div")).toHaveClass("group-hover:opacity-100");
  });
});
