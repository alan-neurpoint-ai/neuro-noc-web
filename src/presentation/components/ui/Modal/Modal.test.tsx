import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal Component", () => {
  it("should not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
        <p>Contenido</p>
      </Modal>,
    );
    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
  });

  it("should render title and children when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="System Alert">
        <p>Critical Error Detected</p>
      </Modal>,
    );
    expect(screen.getByText("System Alert")).toBeInTheDocument();
    expect(screen.getByText("Critical Error Detected")).toBeInTheDocument();
  });

  it("should call onClose when clicking the close button", () => {
    const onCloseMock = vi.fn();
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Modal">
        <p>Content</p>
      </Modal>,
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
