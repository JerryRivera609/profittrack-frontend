import type { Client, ClientScope, ClientStats } from "../types/client";

export function getVisibleClients(clients: Client[], scope: ClientScope) {
  const scopedClients =
    scope.isAdmin || !scope.sessionEmpresaId
      ? clients
      : clients.filter((client) => client.empresaId === scope.sessionEmpresaId);

  return [...scopedClients].sort((a, b) =>
    a.razonSocial.localeCompare(b.razonSocial),
  );
}

export function getClientStats(clients: Client[]): ClientStats[] {
  return [
    {
      label: "Clientes visibles",
      value: clients.length.toString(),
    },
    {
      label: "Activos",
      value: clients.filter((client) => client.activo).length.toString(),
    },
    {
      label: "Contactos",
      value: new Set(clients.map((client) => client.correoContacto)).size.toString(),
    },
  ];
}
