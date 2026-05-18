import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loading } from '../../../../core/presentation/components/ui/Loading';

describe('Loading Component - Radar Design', () => {
  it('debe renderizar el título principal de la marca', () => {
    render(<Loading />);
    expect(screen.getByText('NEURO NOC')).toBeInTheDocument();
  });

  it('debe aplicar el efecto de desenfoque profundo (backdrop-blur-2xl)', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toHaveClass('backdrop-blur-2xl');
  });

  it('debe contener el SVG del radar con gradiente y máscara', () => {
    const { container } = render(<Loading />);
    const svg = container.querySelector('svg');
    const gradient = container.querySelector('linearGradient#sweepGradient');
    const mask = container.querySelector('mask#sweepMask');

    expect(svg).toBeInTheDocument();
    expect(gradient).toBeInTheDocument();
    expect(mask).toBeInTheDocument();
  });

  it('debe aplicar la animación de sweep al radar', () => {
    const { container } = render(<Loading />);
    const sweep = container.querySelector(
      '.animate-\\[radarSweep_4s_infinite_linear\\]'
    );
    expect(sweep).toBeInTheDocument();
  });

  it('debe mostrar el mensaje personalizado y estado de monitoreo', () => {
    render(<Loading message="Escaneando red..." />);
    expect(screen.getByText(/escaneando red/i)).toBeInTheDocument();
    expect(screen.getByText(/monitoreando/i)).toBeInTheDocument();
  });

  it('debe renderizar la barra de progreso con animación', () => {
    const { container } = render(<Loading />);
    const progressBar = container.querySelector(
      '.animate-\\[progress_2s_infinite_ease-in-out\\]'
    );
    expect(progressBar).toBeInTheDocument();
  });

  it('debe incluir los blips (puntos de contacto) con animación de blip', () => {
    const { container } = render(<Loading />);
    const blips = container.querySelectorAll('circle[class*="animate-[blip"]');
    expect(blips.length).toBe(4);
  });

  it('debe renderizar los círculos concéntricos del radar', () => {
    const { container } = render(<Loading />);
    const circles = container.querySelectorAll("circle[fill='none']");
    // 4 círculos concéntricos + 1 anillo exterior = 5
    expect(circles.length).toBe(5);
  });

  it('debe aplicar la variante fullscreen por defecto', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toHaveClass('fixed');
    expect(container.firstChild).toHaveClass('inset-0');
    expect(container.firstChild).toHaveClass('z-[9999]');
  });

  it('debe aplicar la variante overlay cuando se especifica', () => {
    const { container } = render(<Loading variant="overlay" />);
    expect(container.firstChild).toHaveClass('absolute');
    expect(container.firstChild).toHaveClass('z-50');
  });
});
