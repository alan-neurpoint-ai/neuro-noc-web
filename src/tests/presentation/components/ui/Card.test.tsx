import { render, screen } from "@testing-library/react";
import { Card } from "../../../../core/presentation/components/ui/Card";

describe("Card Component - Multimedia Variations", () => {
  it("debe renderizar sin padding cuando se especifica noPadding", () => {
    const { container } = render(<Card noPadding>Graph</Card>);
    expect(container.firstChild).toHaveClass("p-0");
  });

  it("debe aplicar el borde de marca en la variante profile", () => {
    const { container } = render(<Card variant="profile">User</Card>);
    expect(container.firstChild).toHaveClass("border-brand-primary");
  });

  it("debe soportar contenido complejo como imágenes y textos de KPI", () => {
    render(
      <Card variant="stat">
        <span data-testid="kpi-value">80.2%</span>
      </Card>,
    );
    expect(screen.getByTestId("kpi-value")).toHaveTextContent("80.2%");
  });
});
