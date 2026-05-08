import { type InputHTMLAttributes, type ChangeEvent, useRef } from "react";
import { BiSearch, BiX } from "react-icons/bi";

interface SearchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  onSearch: (value: string) => void;
  isLoading?: boolean;
}

export const Search = ({
  onSearch,
  isLoading,
  className = "",
  placeholder = "Buscar activos, nodos o alertas...",
  ...props
}: SearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      onSearch("");
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative group w-full font-headline ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-accent transition-colors duration-300 z-10">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
        ) : (
          <BiSearch size={18} strokeWidth={2.5} />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          w-full bg-bg-surface text-text-main text-sm pl-12 pr-12 py-3.5
          rounded-[15px] border-2 border-white/5 outline-none
          transition-all duration-300
          placeholder:text-text-muted/30
          focus:border-brand-accent focus:shadow-[0_0_20px_rgba(178,154,244,0.15)]
          focus:bg-bg-card
        `}
        {...props}
      />

      <button
        onClick={handleClear}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-all duration-200 opacity-0 group-focus-within:opacity-100"
        title="Limpiar búsqueda"
      >
        <BiX size={18} />
      </button>
    </div>
  );
};
