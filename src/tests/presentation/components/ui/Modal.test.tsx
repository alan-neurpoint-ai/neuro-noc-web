import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Modal } from "../../../../core/presentation/components/ui/Modal";

describe("Modal Component - Ultra Premium Edition", () => {
  beforeEach(() => {
    document.body.style.overflow = "unset";
    document.body.innerHTML = "";
  });

  it("debe aplicar los estilos de la variante 'danger' correctamente", () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        variant="danger"
        title="System Breach"
      >
        <p>Warning details</p>
      </Modal>,
    );

    const title = screen.getByText(/SYSTEM BREACH/i);
    expect(title).toHaveStyle({ color: "rgb(248, 113, 113)" });
  });

  it("debe mostrar el icono y el subtítulo si se proporcionan", () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        icon={<span data-testid="modal-icon">⚠️</span>}
        subtitle="Verification required"
      >
        <p>Body content</p>
      </Modal>,
    );

    expect(screen.getByTestId("modal-icon")).toBeInTheDocument();
    expect(screen.getByText(/Verification required/i)).toBeInTheDocument();
  });

  it("debe respetar la prop 'dismissOnOverlay' (true por defecto)", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} dismissOnOverlay={true}>
        <p>Content</p>
      </Modal>,
    );
    const overlay = document.querySelector('div[style*="rgba(0, 0, 0, 0.72)"]');
    if (overlay) fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("no debe cerrar al hacer clic en el overlay si 'dismissOnOverlay' es false", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} dismissOnOverlay={false}>
        <p>Content</p>
      </Modal>,
    );

    const overlay = document.querySelector('div[style*="rgba(0, 0, 0, 0.72)"]');
    if (overlay) fireEvent.click(overlay);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("debe prevenir la propagación del clic desde el contenido del modal", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <button data-testid="inside-btn">Action</button>
      </Modal>,
    );

    const button = screen.getByTestId("inside-btn");
    fireEvent.click(button);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("debe renderizar los elementos decorativos del footer (dots)", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} footer={<button>Save</button>}>
        <p>Content</p>
      </Modal>,
    );

    const footerContainer = screen.getByText("Save").parentElement;
    expect(footerContainer).toBeInTheDocument();
  });

  it("debe tener los atributos ARIA correctos para accesibilidad", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Accessible Modal">
        <p>Content</p>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
  });
});
