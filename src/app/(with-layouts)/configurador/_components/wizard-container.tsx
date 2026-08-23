"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "@tailgrids/icons";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { PageHeader } from "@/components/crm/shared/page-header";
import type { ValidacionCompleta } from "@/services/api/configurador/client";
import { obtenerOpcionesPaso, validarConfiguracion } from "@/services/api/configurador/client";
import { listarProductos } from "@/services/api/productos/client";
import { booleano, numero } from "@/services/pcbuilder/atributos";
import type { EvaluacionProducto, Paso, ProductoDTO, SeleccionConfiguracion } from "@/services/pcbuilder/types";
import { DEFINICION_PASOS } from "./pasos-config";
import { GuardarCotizacionDialog } from "./guardar-cotizacion-dialog";
import { OpcionesGrid } from "./opciones-grid";
import { ResumenPanel, type FilaResumen } from "./resumen-panel";
import { StepIndicator } from "./step-indicator";
import { ValidacionAlerts } from "./validacion-alerts";

const CATEGORIA_CPU = "Procesadores";

export default function WizardContainer() {
  const [indicePaso, setIndicePaso] = useState(0);
  const [seleccion, setSeleccion] = useState<SeleccionConfiguracion>({});
  const [elegidos, setElegidos] = useState<Record<number, ProductoDTO>>({});
  const [resultadoValidacion, setResultadoValidacion] = useState<ValidacionCompleta | null>(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);

  const pasoActual = DEFINICION_PASOS[indicePaso].paso;

  const cpuQuery = useQuery({
    queryKey: ["configurador", "cpu"],
    queryFn: () => listarProductos({ categoria: CATEGORIA_CPU }),
    enabled: pasoActual === "cpu",
    staleTime: 60_000,
  });

  const opcionesQuery = useQuery({
    queryKey: ["configurador", "opciones", pasoActual, seleccion],
    queryFn: () => obtenerOpcionesPaso(pasoActual as Exclude<Paso, "cpu">, seleccion),
    enabled: pasoActual !== "cpu",
    staleTime: 30_000,
  });

  const opciones = useMemo<EvaluacionProducto[]>(() => {
    if (pasoActual === "cpu") {
      return (cpuQuery.data ?? []).map((producto) => ({ producto, compatible: true, motivos: [] }));
    }
    return opcionesQuery.data?.opciones ?? [];
  }, [pasoActual, cpuQuery.data, opcionesQuery.data]);

  const cargando = pasoActual === "cpu" ? cpuQuery.isPending : opcionesQuery.isPending;

  const validarMutation = useMutation({
    mutationFn: () => validarConfiguracion(seleccion),
    onSuccess: (data) => {
      setResultadoValidacion(data);
      if (data.valido) toast.success("Configuración válida");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cpuElegido = seleccion.cpuId ? elegidos[seleccion.cpuId] : undefined;
  const caseElegido = seleccion.caseId ? elegidos[seleccion.caseId] : undefined;
  const requiereCooler = !cpuElegido || booleano(cpuElegido.atributos, "requiereCooler");
  const requiereGpu = !cpuElegido || !booleano(cpuElegido.atributos, "tieneGraficosIntegrados");
  const requierePsu = !caseElegido || !booleano(caseElegido.atributos, "tieneFuentePoder");

  function esSaltable(paso: Paso): boolean {
    if (paso === "cooler") return !requiereCooler;
    if (paso === "gpu") return !requiereGpu;
    if (paso === "psu") return !requierePsu;
    return false;
  }

  const pasosCompletados = new Set<string>(
    DEFINICION_PASOS.map((d) => d.paso).filter((p) => slotLleno(p, seleccion)),
  );
  const pasosSaltables = new Set(DEFINICION_PASOS.map((d) => d.paso).filter(esSaltable));

  function avanzar() {
    let i = indicePaso + 1;
    while (i < DEFINICION_PASOS.length && esSaltable(DEFINICION_PASOS[i].paso)) i++;
    setIndicePaso(Math.min(i, DEFINICION_PASOS.length - 1));
  }

  function retroceder() {
    let i = indicePaso - 1;
    while (i > 0 && esSaltable(DEFINICION_PASOS[i].paso)) i--;
    setIndicePaso(Math.max(i, 0));
  }

  function irA(indice: number) {
    setResultadoValidacion(null);
    setIndicePaso(Math.min(Math.max(indice, 0), DEFINICION_PASOS.length - 1));
  }

  function seleccionarProducto(productoId: number, producto?: ProductoDTO) {
    setResultadoValidacion(null);
    if (!producto) return;

    if (pasoActual === "ram") {
      const actuales = seleccion.ramIds ?? [];
      const yaEsta = actuales.includes(productoId);

      let nuevos = actuales;
      if (yaEsta) {
        nuevos = actuales.filter((id) => id !== productoId);
      } else {
        const slotsPlaca = seleccion.placaId
          ? numero(elegidos[seleccion.placaId]?.atributos ?? {}, "ramSlots")
          : undefined;
        if (slotsPlaca !== undefined && actuales.length >= slotsPlaca) {
          toast.warning(`La placa solo admite ${slotsPlaca} módulos de RAM`);
          return;
        }
        nuevos = [...actuales, productoId];
      }
      setSeleccion((s) => ({ ...s, ramIds: nuevos }));
    } else {
      const clave = CLAVE_POR_PASO[pasoActual as Exclude<Paso, "ram">];
      setSeleccion((s) => ({ ...s, [clave]: s[clave] === productoId ? undefined : productoId }));
    }

    setElegidos((prev) => ({ ...prev, [productoId]: producto }));
  }

  function limpiar() {
    setSeleccion({});
    setElegidos({});
    setResultadoValidacion(null);
    setIndicePaso(0);
  }

  const filasResumen: FilaResumen[] = [
    {
      etiqueta: "CPU",
      obligatorio: true,
      productos: seleccion.cpuId && elegidos[seleccion.cpuId] ? [elegidos[seleccion.cpuId]] : [],
    },
    {
      etiqueta: "Placa madre",
      obligatorio: true,
      productos: seleccion.placaId && elegidos[seleccion.placaId] ? [elegidos[seleccion.placaId]] : [],
    },
    {
      etiqueta: "RAM",
      obligatorio: true,
      productos: (seleccion.ramIds ?? []).map((id) => elegidos[id]).filter(Boolean),
    },
    {
      etiqueta: "GPU",
      obligatorio: requiereGpu,
      productos: seleccion.gpuId && elegidos[seleccion.gpuId] ? [elegidos[seleccion.gpuId]] : [],
    },
    {
      etiqueta: "Cooler",
      obligatorio: requiereCooler,
      productos: seleccion.coolerId && elegidos[seleccion.coolerId] ? [elegidos[seleccion.coolerId]] : [],
    },
    {
      etiqueta: "Case",
      obligatorio: true,
      productos: seleccion.caseId && elegidos[seleccion.caseId] ? [elegidos[seleccion.caseId]] : [],
    },
    {
      etiqueta: "PSU",
      obligatorio: requierePsu,
      productos: seleccion.psuId && elegidos[seleccion.psuId] ? [elegidos[seleccion.psuId]] : [],
    },
  ];

  const total = filasResumen
    .flatMap((fila) => fila.productos)
    .reduce((suma, p) => suma + p.precioVenta, 0);

  const idsActuales = idsDePaso(pasoActual, seleccion);

  const detallesCotizacion = filasResumen.flatMap((fila) =>
    fila.productos.map((p) => ({ productoId: p.id, cantidad: 1 })),
  );

  const esUltimoPaso = indicePaso === DEFINICION_PASOS.length - 1;

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        titulo="Configurador de PC"
        items={[
          { href: "/", label: "Home" },
          { href: "/configurador", label: "Configurador de PC" },
        ]}
      />

      <div className="space-y-5 px-2 lg:px-5">
        <Card>
          <StepIndicator
            pasos={DEFINICION_PASOS}
            indiceActual={indicePaso}
            pasosCompletados={pasosCompletados}
            pasosSaltables={pasosSaltables}
            onSeleccionar={irA}
          />
        </Card>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Paso {indicePaso + 1}: {DEFINICION_PASOS[indicePaso].etiqueta}
                </h2>
                <p className="text-sm text-text-secondary">
                  {DEFINICION_PASOS[indicePaso].descripcion}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  appearance="outline"
                  size="sm"
                  onPress={retroceder}
                  isDisabled={indicePaso === 0}
                >
                  <ChevronLeft className="size-4" />
                  Anterior
                </Button>
                {!esUltimoPaso ? (
                  <Button size="sm" onPress={avanzar}>
                    Siguiente
                    <ChevronRight className="size-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="success"
                    onPress={() => setDialogoAbierto(true)}
                    isDisabled={!resultadoValidacion?.valido}
                  >
                    Guardar cotización
                  </Button>
                )}
              </div>
            </div>

            <OpcionesGrid
              opciones={opciones}
              idsSeleccionados={idsActuales}
              cargando={cargando}
              onSeleccionar={(id) => seleccionarProducto(id, opciones.find((o) => o.producto.id === id)?.producto)}
            />

            {!esUltimoPaso && (
              <div className="flex justify-end">
                <Button onPress={avanzar}>
                  Siguiente paso
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4 xl:sticky xl:top-6">
            <ResumenPanel
              filas={filasResumen}
              total={total}
              validando={validarMutation.isPending}
              puedeGuardar={Boolean(resultadoValidacion?.valido)}
              onValidar={() => validarMutation.mutate()}
              onGuardar={() => setDialogoAbierto(true)}
              onLimpiar={limpiar}
            />
            <ValidacionAlerts resultado={resultadoValidacion} />
          </div>
        </div>
      </div>

      <GuardarCotizacionDialog
        abierto={dialogoAbierto}
        onOpenChange={setDialogoAbierto}
        detalles={detallesCotizacion}
      />
    </div>
  );
}

const CLAVE_POR_PASO: Record<Exclude<Paso, "ram">, "cpuId" | "placaId" | "gpuId" | "coolerId" | "caseId" | "psuId"> = {
  cpu: "cpuId",
  placa: "placaId",
  gpu: "gpuId",
  cooler: "coolerId",
  case: "caseId",
  psu: "psuId",
};

function slotLleno(paso: Paso, seleccion: SeleccionConfiguracion): boolean {
  if (paso === "ram") return (seleccion.ramIds?.length ?? 0) > 0;
  const clave = CLAVE_POR_PASO[paso as Exclude<Paso, "ram">];
  return typeof seleccion[clave] === "number";
}

function idsDePaso(paso: Paso, seleccion: SeleccionConfiguracion): number[] {
  if (paso === "ram") return seleccion.ramIds ?? [];
  const clave = CLAVE_POR_PASO[paso as Exclude<Paso, "ram">];
  const valor = seleccion[clave];
  return typeof valor === "number" ? [valor] : [];
}
