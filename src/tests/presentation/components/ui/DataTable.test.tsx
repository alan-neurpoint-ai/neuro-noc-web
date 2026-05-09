import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DataTable } from "../../../../core/presentation/components/ui/DataTable";

describe("DataTable Component - Premium NOC Build", () => {
  const mockColumns = [
    { header: "ID", accessor: "id" as const },
    { header: "Nombre", accessor: "name" as const },
  ];

  const mockData = [
    { id: "1", name: "Server Alpha" },
    { id: "2", name: "Server Beta" },
  ];

  it("debe renderizar el título y subtítulo con los estilos correctos", () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        title="Monitor de Nodos"
        subtitle="Estado en tiempo real"
      />,
    );

    expect(screen.getByText("Monitor de Nodos")).toBeInTheDocument();
    expect(screen.getByText("Estado en tiempo real")).toBeInTheDocument();
  });

  it("debe mostrar el contador exacto de registros en el badge superior", () => {
    render(<DataTable columns={mockColumns} data={mockData} title="Test" />);
    const badge = screen.getByText("2 registros");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({ color: "#b29af4" });
  });

  it("debe ejecutar onRowClick al seleccionar una celda", () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onRowClick={onRowClick}
      />,
    );

    const rowCell = screen.getByText("Server Alpha");
    fireEvent.click(rowCell);

    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it("debe aplicar el estado de Hover programático correctamente", () => {
    render(
      <DataTable columns={mockColumns} data={mockData} onRowClick={() => {}} />,
    );

    const cell = screen.getByText("Server Alpha").closest("td");

    // Simular MouseEnter para validar cambio de estilo dinámico
    fireEvent.mouseEnter(cell!);
    expect(cell).toHaveStyle({ background: "rgba(103,45,169,0.18)" });
    expect(cell).toHaveStyle({ color: "#ffffff" });

    // Simular MouseLeave para validar retorno al estado base
    fireEvent.mouseLeave(cell!);
    expect(cell).toHaveStyle({ background: "rgba(255,255,255,0.025)" });
  });

  it('debe mostrar el estado "Sin datos disponibles" con su iconografía', () => {
    render(<DataTable columns={mockColumns} data={[]} />);
    expect(screen.getByText("Sin datos disponibles")).toBeInTheDocument();
    expect(
      screen.getByText("No hay registros para mostrar"),
    ).toBeInTheDocument();
  });

  it("debe renderizar el Skeleton Loader (5 filas) cuando isLoading es true", () => {
    const { container } = render(
      <DataTable columns={mockColumns} data={[]} isLoading={true} />,
    );
    const skeletonCells = container.querySelectorAll("tbody tr td div.h-3");
    // 5 filas * 2 columnas = 10 elementos de skeleton
    expect(skeletonCells.length).toBe(10);
  });
});
