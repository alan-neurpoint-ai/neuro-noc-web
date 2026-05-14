import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../../../../core/presentation/components/ui/Input';

describe('Input Component - Intelligence System Validation', () => {
  it('debe aplicar el radio de esquina de 12px definido en el sistema visual', () => {
    render(<Input placeholder="Geometry Test" />);
    const inputElement = screen.getByPlaceholderText('Geometry Test');
    expect(inputElement).toHaveClass('rounded-[12px]');
  });

  it('debe validar y permitir solo numeros cuando validationType es numeric', () => {
    const handleInputChange = vi.fn();
    render(
      <Input
        validationType="numeric"
        onChange={handleInputChange}
        placeholder="Numeric Only"
      />
    );
    const inputElement = screen.getByPlaceholderText('Numeric Only');

    fireEvent.change(inputElement, { target: { value: 'abc' } });
    expect(handleInputChange).not.toHaveBeenCalled();

    fireEvent.change(inputElement, { target: { value: '123' } });
    expect(handleInputChange).toHaveBeenCalled();
  });

  it('debe permitir prefijos telefonicos internacionales', () => {
    const handleInputChange = vi.fn();
    render(
      <Input
        validationType="phonePrefix"
        onChange={handleInputChange}
        placeholder="Prefix"
      />
    );
    const inputElement = screen.getByPlaceholderText('Prefix');

    fireEvent.change(inputElement, { target: { value: '+52' } });
    expect(handleInputChange).toHaveBeenCalled();

    fireEvent.change(inputElement, { target: { value: '+52a' } });
    expect(handleInputChange).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar estilos de error y el mensaje con la fuente label', () => {
    render(<Input error="Validation Failed" />);
    const errorMessage = screen.getByText(/validation failed/i);

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('font-label', 'text-status-error');
    expect(screen.getByRole('textbox')).toHaveClass('border-status-error');
  });

  it('debe cambiar el color del icono al foco principal (brand-primary)', () => {
    render(<Input icon={<span data-testid="search-icon">🔍</span>} />);
    const iconWrapper = screen.getByTestId('search-icon').parentElement;
    expect(iconWrapper).toHaveClass('group-focus-within:text-brand-primary');
  });

  it('debe utilizar la fuente body para el texto ingresado por el usuario', () => {
    render(<Input placeholder="Typography Test" />);
    const inputElement = screen.getByPlaceholderText('Typography Test');
    expect(inputElement).toHaveClass('font-body');
  });

  it('debe aplicar el estilo de anillo (ring) en lugar de sombra pesada al hacer foco', () => {
    render(<Input placeholder="Focus Test" />);
    const inputElement = screen.getByPlaceholderText('Focus Test');
    expect(inputElement).toHaveClass(
      'focus:ring-4',
      'focus:ring-brand-primary/10'
    );
  });
});
