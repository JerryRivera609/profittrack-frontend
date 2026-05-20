import type {
  ServiceType,
  ServiceTypeScope,
  ServiceTypeStats,
} from "../types/service-type";

export function getVisibleServiceTypes(
  serviceTypes: ServiceType[],
  scope: ServiceTypeScope,
) {
  const scopedServiceTypes =
    scope.isAdmin || !scope.sessionEmpresaId
      ? serviceTypes
      : serviceTypes.filter(
          (serviceType) => serviceType.empresaId === scope.sessionEmpresaId,
        );

  return [...scopedServiceTypes].sort((a, b) =>
    a.nombre.localeCompare(b.nombre),
  );
}

export function getServiceTypeStats(
  serviceTypes: ServiceType[],
): ServiceTypeStats[] {
  return [
    {
      label: "Tipos visibles",
      value: serviceTypes.length.toString(),
    },
    {
      label: "Activos",
      value: serviceTypes.filter((serviceType) => serviceType.activo).length.toString(),
    },
    {
      label: "Empresas",
      value: new Set(serviceTypes.map((serviceType) => serviceType.empresaId)).size.toString(),
    },
  ];
}
