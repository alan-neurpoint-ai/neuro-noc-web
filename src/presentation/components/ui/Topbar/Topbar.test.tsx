import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Topbar, type Organization } from "./Topbar";

describe("Topbar Component", () => {
  const mockOrgs: Organization[] = [
    { id: "1", name: "Organización 1" },
    { id: "2", name: "Organización 2" },
    { id: "3", name: "Interno", isInternal: true },
  ];

  const mockOnOrgChange = vi.fn();

  it("debe mostrar el nombre de la organización actual", () => {
    render(
      <Topbar
        organizations={mockOrgs}
        currentOrg={mockOrgs[0]}
        onOrgChange={mockOnOrgChange}
      />,
    );
    expect(screen.getByText("Organización 1")).toBeInTheDocument();
  });

  it("debe desplegar la lista al hacer clic en el selector", () => {
    render(
      <Topbar
        organizations={mockOrgs}
        currentOrg={mockOrgs[0]}
        onOrgChange={mockOnOrgChange}
      />,
    );

    const selector = screen.getByRole("button", { name: /organización 1/i });
    fireEvent.click(selector);
    expect(screen.getByText("Organización 2")).toBeInTheDocument();
    const internoElements = screen.getAllByText("Interno");
    expect(internoElements.length).toBeGreaterThan(0);
  });

  it("debe llamar a onOrgChange con la organización correcta al seleccionar una nueva", () => {
    render(
      <Topbar
        organizations={mockOrgs}
        currentOrg={mockOrgs[0]}
        onOrgChange={mockOnOrgChange}
      />,
    );

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Organización 2"));
    expect(mockOnOrgChange).toHaveBeenCalledWith(mockOrgs[1]);
  });
});
