import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Topbar } from "../../../../core/presentation/components/ui/Topbar";
import { BiLockAlt, BiWorld } from "react-icons/bi";

const mockEnvOptions = [
  {
    value: "interno",
    label: "Interno",
    icon: <BiLockAlt data-testid="icon-interno" />,
    description: "Red Privada",
  },
  {
    value: "externo",
    label: "Externo",
    icon: <BiWorld />,
    description: "Acceso Público",
  },
];

describe("Topbar Component - Neuro NOC", () => {
  const defaultProps = {
    envOptions: mockEnvOptions,
    onEnvChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✓ Renderizado: Debe mostrar el entorno inicial por defecto", () => {
    render(<Topbar {...defaultProps} />);
    expect(screen.getByText("Interno")).toBeInTheDocument();
    expect(screen.getByText("Red Privada")).toBeInTheDocument();
  });

  it("✓ Interacción: Debe abrir el menú y mostrar todas las opciones", () => {
    render(<Topbar {...defaultProps} />);
    const selectTrigger = screen.getByRole("button");
    fireEvent.click(selectTrigger);
    expect(screen.getByText("Externo")).toBeInTheDocument();
    expect(screen.getByText("Acceso Público")).toBeInTheDocument();
  });

  it("✓ Selección: Debe llamar a onEnvChange al seleccionar una nueva opción", () => {
    render(<Topbar {...defaultProps} />);
    const selectTrigger = screen.getByRole("button");
    fireEvent.click(selectTrigger);
    const optionExterno = screen.getByText("Externo").closest("button");
    if (optionExterno) fireEvent.click(optionExterno);

    expect(defaultProps.onEnvChange).toHaveBeenCalledWith("externo");
  });

  it("✓ Estética: Debe aplicar las clases de glassmorphism", () => {
    const { container } = render(<Topbar {...defaultProps} />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("sticky", "top-0", "backdrop-blur-xl");
    expect(header).toHaveClass("bg-brand-primary/40");
  });

  it("✓ Prop currentEnv: Debe respetar el valor controlado externamente", () => {
    render(<Topbar {...defaultProps} currentEnv="externo" />);
    expect(screen.getByText("Externo")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Externo");
  });
});
