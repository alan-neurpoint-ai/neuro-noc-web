import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  HiPlus,
  HiEye,
  HiMail,
  HiPhone,
  HiUserCircle,
  HiBriefcase,
  HiUsers,
  HiUserGroup,
} from "react-icons/hi";
import { useSelectedClient } from "../context/SelectedClientContext";
import { useContacts } from "../../../hooks/useContacts";
import { Button, Card, Table } from "../../../components/ui";

export default function AdminContacts() {
  const navigate = useNavigate();
  const { selectedClient } = useSelectedClient();
  const { contacts, isLoading, fetchContacts } = useContacts(
    selectedClient?.id,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (selectedClient?.id) {
      fetchContacts();
    }
  }, [selectedClient?.id, fetchContacts]);

  const handleViewContact = (contactId: string) => {
    navigate(`/dashboard/admin/contactos/${contactId}`);
  };

  const handleNewContact = () => {
    navigate(`/dashboard/admin/contactos/nuevo`);
  };

  // Estadísticas
  const internalContacts = contacts.filter((c) => c.is_internal).length;
  const externalContacts = contacts.filter((c) => !c.is_internal).length;

  // Columnas para la tabla
  const columns = [
    {
      header: "Contacto",
      accessor: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <HiUserCircle size={18} />
          </div>
          <div>
            <p className="font-medium text-text-primary">{item.full_name}</p>
            {item.job_title && (
              <p className="text-xs text-text-muted">{item.job_title}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Contacto",
      accessor: (item: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <HiMail size={12} className="text-accent/60" />
            <span className="text-sm text-text-secondary">{item.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiPhone size={12} className="text-accent/60" />
            <span className="text-sm text-text-secondary">
              {item.phone_number}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Tipo",
      accessor: (item: any) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            item.is_internal
              ? "bg-accent/20 text-accent"
              : "bg-blue-primary/20 text-blue-glow"
          }`}
        >
          {item.is_internal ? "Interno" : "Externo"}
        </span>
      ),
    },
    {
      header: "Acciones",
      accessor: (item: any) => (
        <button
          onClick={() => handleViewContact(item.id)}
          className="flex items-center gap-1 px-2 py-1 rounded-sm text-accent hover:bg-accent/20 transition-colors"
        >
          <HiEye size={16} />
          <span className="text-xs">Ver</span>
        </button>
      ),
    },
  ];

  const totalPages = Math.ceil(contacts.length / itemsPerPage);
  const paginatedContacts = contacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const clientName = selectedClient?.isInternal
    ? "mi organización"
    : selectedClient?.name || "seleccionada";

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-8 bg-accent rounded-full" />
            <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
              Contactos de <span className="text-accent">{clientName}</span>
            </h1>
          </div>
          <p className="text-text-muted text-sm ml-3">
            Gestión de contactos para escalamiento de alertas
          </p>
        </div>

        <Button
          variant="success"
          onClick={handleNewContact}
          className="flex items-center gap-2"
        >
          <HiPlus size={18} />
          Nuevo Contacto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <Card
          title="Total Contactos"
          value={contacts.length}
          icon={<HiUsers size={20} />}
        />
        <Card
          title="Contactos Internos"
          value={internalContacts}
          icon={<HiUserGroup size={20} />}
          subtitle="Usuarios del sistema"
        />
        <Card
          title="Contactos Externos"
          value={externalContacts}
          icon={<HiBriefcase size={20} />}
          subtitle="Clientes o proveedores"
        />
      </div>

      {/* Tabla de contactos */}
      <Table
        data={paginatedContacts}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />
    </div>
  );
}
