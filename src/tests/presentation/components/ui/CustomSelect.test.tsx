import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  CustomSelect,
  SelectOption,
} from '../../../../core/presentation/components/ui/CustomSelect';

const mockOptions: SelectOption[] = [
  { value: 'opt1', label: 'Option 1', description: 'First desc' },
  { value: 'opt2', label: 'Option 2', description: 'Second desc' },
];

describe('CustomSelect Component - High-Performance Engineering Edition', () => {
  it('debe renderizar correctamente', () => {
    render(
      <CustomSelect
        options={mockOptions}
        onChange={() => {}}
        label="NOC Selector"
      />
    );
    expect(screen.getByText(/NOC SELECTOR/i)).toBeInTheDocument();
  });

  it('debe abrir el listbox y mostrar descripciones sin ambigüedad', () => {
    render(<CustomSelect options={mockOptions} onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    // Validar descripción dentro de la lista para evitar falsos positivos
    expect(within(listbox).getByText('First desc')).toBeInTheDocument();
  });

  it('debe navegar por opciones usando el teclado', () => {
    const onChange = vi.fn();
    render(<CustomSelect options={mockOptions} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('opt2');
  });

  it('debe cerrar el menú al presionar Escape', () => {
    render(<CustomSelect options={mockOptions} onChange={() => {}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('debe detectar clics externos', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <CustomSelect options={mockOptions} onChange={() => {}} />
      </div>
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('debe resaltar visualmente la opción seleccionada con el color de acento', () => {
    render(
      <CustomSelect options={mockOptions} onChange={() => {}} value="opt1" />
    );
    fireEvent.click(screen.getByRole('button'));
    const listbox = screen.getByRole('listbox');
    const optionInList = within(listbox).getByText('Option 1');
    expect(optionInList).toHaveClass('text-[#7aa2f7]');
  });
});
