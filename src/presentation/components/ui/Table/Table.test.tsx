import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Table } from "./Table";

const MOCK_COLUMNS = [
  { header: "ID", accessor: "id" as const },
  { header: "Status", accessor: "status" as const },
];

const MOCK_DATA = [
  { id: "NODE-01", status: "Online" },
  { id: "NODE-02", status: "Offline" },
];

describe("Table Component", () => {
  it("should render the correct number of data rows", () => {
    render(
      <Table
        data={MOCK_DATA}
        columns={MOCK_COLUMNS}
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByText("NODE-01")).toBeInTheDocument();
    expect(screen.getByText("NODE-02")).toBeInTheDocument();
  });

  it("should maintain exactly 10 rows height (data + empty rows)", () => {
    const { container } = render(
      <Table
        data={MOCK_DATA}
        columns={MOCK_COLUMNS}
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    );
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(10);
  });

  it("should call onPageChange when pagination buttons are clicked", () => {
    const onPageChangeMock = vi.fn();
    render(
      <Table
        data={MOCK_DATA}
        columns={MOCK_COLUMNS}
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />,
    );
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    expect(onPageChangeMock).toHaveBeenCalledWith(1);
    fireEvent.click(buttons[1]);
    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });

  it("should show loading overlay and disable buttons when isLoading is true", () => {
    render(
      <Table
        data={MOCK_DATA}
        columns={MOCK_COLUMNS}
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
        isLoading={true}
      />,
    );

    expect(screen.getByText(/sincronizando/i)).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("should render custom content when accessor is a function", () => {
    const customColumns = [
      {
        header: "Acción",
        accessor: (item: any) => <button>{`Edit ${item.id}`}</button>,
      },
    ];

    render(
      <Table
        data={MOCK_DATA}
        columns={customColumns}
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Edit NODE-01")).toBeInTheDocument();
  });
});
