import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../../../core/presentation/components/ui/Button';

describe('Button Component - Intelligence System UI', () => {
  it('debe aplicar el radio de esquina de 12px definido en el rediseño', () => {
    const { container } = render(<Button>Geometric Test</Button>);
    expect(container.firstChild).toHaveClass('rounded-[12px]');
  });

  it('debe utilizar la fuente headline para el contenido del boton', () => {
    const { container } = render(<Button>Typography Test</Button>);
    expect(container.firstChild).toHaveClass('font-headline');
  });

  it('debe aplicar los estilos de la variante primary correctamente', () => {
    const { container } = render(
      <Button variant="primary">Primary Action</Button>
    );
    expect(container.firstChild).toHaveClass('bg-brand-primary');
    expect(container.firstChild).toHaveClass('text-white');
  });

  it('debe aplicar la variante tertiary con el color de fondo principal para el texto', () => {
    const { container } = render(
      <Button variant="tertiary">Tertiary Action</Button>
    );
    expect(container.firstChild).toHaveClass('bg-brand-tertiary');
    expect(container.firstChild).toHaveClass('text-bg-main');
  });

  it('debe ejecutar la funcion onClick al detectar una interaccion de usuario', () => {
    const handleButtonClick = vi.fn();
    render(<Button onClick={handleButtonClick}>Execute</Button>);

    fireEvent.click(screen.getByText(/execute/i));
    expect(handleButtonClick).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar el indicador de procesamiento y deshabilitar el boton', () => {
    render(<Button isLoading>Action</Button>);
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('debe utilizar la fuente label para el texto de carga', () => {
    render(<Button isLoading>Action</Button>);
    const loadingText = screen.getByText(/processing/i);
    expect(loadingText).toHaveClass('font-label');
  });

  it('debe expandirse al ancho total del contenedor si se activa fullWidth', () => {
    const { container } = render(<Button fullWidth>Wide Button</Button>);
    expect(container.firstChild).toHaveClass('w-full');
  });
});
