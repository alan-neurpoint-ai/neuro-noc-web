import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Notification } from "./Notification";

describe("Notification Component", () => {
  it("should render title and message correctly", () => {
    render(
      <Notification
        id="1"
        type="success"
        title="Backup OK"
        message="Sincronización completa"
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText(/BACKUP OK/i)).toBeInTheDocument();
    expect(screen.getByText("Sincronización completa")).toBeInTheDocument();
  });

  it("should call onClose after duration", () => {
    vi.useFakeTimers();
    const onCloseMock = vi.fn();

    render(
      <Notification
        id="1"
        type="info"
        title="Test"
        message="Msg"
        onClose={onCloseMock}
        duration={3000}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onCloseMock).toHaveBeenCalledWith("1");
    vi.useRealTimers();
  });
});
