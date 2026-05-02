import { Button } from "./presentation/components/ui/Button/Button";

export default function App() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 p-8">
        <Button variant="login" onClick={() => console.log("Auth")} />
        <Button variant="delete">Eliminar Nodo</Button>
        <Button variant="cancel" className="opacity-80" />
      </div>
    </div>
  );
}
