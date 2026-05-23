import { BiPlus } from 'react-icons/bi';
import { Search } from '../../../../core/presentation/components/ui/Search';
import { Button } from '../../../../core/presentation/components/ui/Button';

interface RuleListHeaderProps {
  onSearch: (value: string) => void;
  searchTerm: string;
  debouncedSearch: string;
  onCreate: () => void;
  loading: boolean;
}

export const RuleListHeader = ({
  onSearch,
  searchTerm,
  debouncedSearch,
  onCreate,
  loading,
}: RuleListHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
      <div>
        <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase">
          Reglas de Negocio
        </h1>
        <p className="text-sm text-text-muted font-headline">
          Gestión de reglas automatizadas
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <Search
          onSearch={onSearch}
          placeholder="Buscar..."
          className="w-full md:w-72"
          isLoading={loading || searchTerm !== debouncedSearch}
        />
        <Button
          variant="action"
          icon={<BiPlus />}
          className="w-full sm:w-auto"
          onClick={onCreate}
        >
          NUEVA REGLA
        </Button>
      </div>
    </div>
  );
};
