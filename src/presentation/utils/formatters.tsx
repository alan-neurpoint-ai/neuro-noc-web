export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getStatusBadge = (status: string) => {
  const styles = {
    paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    overdue: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  };
  const labels = { paid: "Pagado", pending: "Pendiente", overdue: "Vencido" };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${styles[status as keyof typeof styles]}`}
    >
      {labels[status as keyof typeof labels]}
    </span>
  );
};
