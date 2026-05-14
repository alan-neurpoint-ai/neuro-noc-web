import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataTable } from '../../../../core/presentation/components/ui/DataTable';

describe('DataTable Component - Premium NOC Build', () => {
  const mockColumns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Nombre', accessor: 'name' as const },
  ];

  const mockData = [
    { id: '1', name: 'Server Alpha' },
    { id: '2', name: 'Server Beta' },
  ];

  it('debe renderizar el título y subtítulo con los estilos correctos', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        title="Monitor de Nodos"
        subtitle="Estado en tiempo real"
      />
    );

    expect(screen.getByText('Monitor de Nodos')).toBeInTheDocument();
    expect(screen.getByText('Estado en tiempo real')).toBeInTheDocument();
  });

  it('debe garantizar la altura fija estricta de h-140 (560px)', () => {
    const { container } = render(
      <DataTable columns={mockColumns} data={mockData} />
    );
    const fixedContainer = container.querySelector('.h-\\[560px\\]');
    expect(fixedContainer).toBeInTheDocument();
    expect(fixedContainer).toHaveClass('relative', 'flex-1', 'overflow-hidden');
  });

  it('debe mostrar el contador exacto de registros en el badge superior', () => {
    render(<DataTable columns={mockColumns} data={mockData} title="Test" />);
    const badge = screen.getByText('2 registros');
    expect(badge).toBeInTheDocument();
    // Validamos clase Tailwind de color brand-accent
    expect(badge).toHaveClass('text-brand-accent');
  });

  it('debe ejecutar onRowClick al seleccionar una celda', () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onRowClick={onRowClick}
      />
    );

    const rowCell = screen.getByText('Server Alpha');
    fireEvent.click(rowCell);

    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('debe aplicar el estado de Hover programático correctamente', () => {
    render(
      <DataTable columns={mockColumns} data={mockData} onRowClick={() => {}} />
    );

    const cell = screen.getByText('Server Alpha').closest('td');
    fireEvent.mouseEnter(cell!);
    expect(cell).toHaveClass('group-hover:bg-brand-primary/20');
    expect(cell).toHaveClass('group-hover:text-white');

    // Validamos el estilo inline base (background inicial)
    expect(cell).toHaveStyle({ background: 'rgba(255,255,255,0.025)' });
  });

  it('debe mostrar el estado "Sin datos disponibles" con su iconografía centrada', () => {
    render(<DataTable columns={mockColumns} data={[]} />);
    const emptyStateCell = screen
      .getByText('Sin datos disponibles')
      .closest('td');

    expect(emptyStateCell).toBeInTheDocument();
    // Verificamos que ocupe gran parte del espacio de la altura fija
    expect(emptyStateCell).toHaveClass('h-[400px]');
  });

  it('debe renderizar el Skeleton Loader (8 filas) cuando isLoading es true', () => {
    const { container } = render(
      <DataTable columns={mockColumns} data={[]} isLoading={true} />
    );

    // Buscamos las filas en el tbody durante el loading
    const skeletonRows = container.querySelectorAll('tbody tr');
    // Ahora hemos definido 8 filas para llenar mejor los 560px de altura
    expect(skeletonRows.length).toBe(8);

    // Verificamos que las celdas tengan la clase de fondo del skeleton
    const skeletonCells = container.querySelectorAll('tbody tr td');
    expect(skeletonCells[0]).toHaveClass('bg-white/5');
  });
});
