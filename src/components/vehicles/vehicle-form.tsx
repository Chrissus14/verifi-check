"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import {
  vehicleSchema,
  type Vehicle,
  type VehicleFormValues,
  type BrandRule,
  type VehicleCatalogEntry,
  type VehicleType,
} from "@/types/vehicle";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";

interface VehicleFormProps {
  editingVehicle?: Vehicle | null;
  onSuccess?: () => void;
}

export function VehicleForm({ editingVehicle, onSuccess }: VehicleFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brandRules, setBrandRules] = useState<BrandRule[]>([]);
  const [catalog, setCatalog] = useState<VehicleCatalogEntry[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema) as Resolver<VehicleFormValues>,
    defaultValues: {
      brand: "",
      sub_brand: "",
      model_year: new Date().getFullYear(),
      test_type: "Dinámica",
      vehicle_type: undefined,
      traction: undefined,
      save_as_rule: false,
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (editingVehicle) {
      form.reset({
        brand: editingVehicle.brand,
        sub_brand: editingVehicle.sub_brand,
        model_year: editingVehicle.model_year,
        test_type: editingVehicle.test_type,
        vehicle_type: editingVehicle.vehicle_type ?? undefined,
        traction: editingVehicle.traction ?? undefined,
        save_as_rule: false,
      });
      setOpen(true);
    }
  }, [editingVehicle, form]);

  // Reset form when closing
  useEffect(() => {
    if (!open && !editingVehicle) {
      form.reset({
        brand: "",
        sub_brand: "",
        model_year: new Date().getFullYear(),
        test_type: "Dinámica",
        vehicle_type: undefined,
        traction: undefined,
        save_as_rule: false,
      });
    }
  }, [open, editingVehicle, form]);

  // Fetch user brand rules and catalog
  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: rules }, { data: catalogData }] = await Promise.all([
        supabase.from("brand_rules").select("*").eq("user_id", user.id),
        supabase.from("vehicle_catalog").select("*").eq("user_id", user.id),
      ]);

      if (rules) setBrandRules(rules);
      if (catalogData) setCatalog(catalogData);
    }

    if (open) {
      fetchData();
    }
  }, [open, supabase]);

  // Smart Logic
  const watchedBrand = form.watch("brand");
  const watchedSubBrand = form.watch("sub_brand");
  const watchedVehicleType = form.watch("vehicle_type");

  const showTraction = watchedVehicleType === "automóvil" || watchedVehicleType === "camioneta";

  useEffect(() => {
    if (watchedBrand && !editingVehicle) {
      // Only auto-fill if not editing
      // 1. Check User-defined rules first
      const userRule = brandRules.find(
        (r) => r.brand.toLowerCase() === watchedBrand.toLowerCase(),
      );

      if (userRule) {
        form.setValue("test_type", userRule.test_type);
        return;
      }

      // 2. No automatic fallback to predefined rules as per "exclusively user data" requirement
    }
  }, [watchedBrand, watchedSubBrand, form, brandRules, editingVehicle]);

  // Helper for Title Case formatting
  const toTitleCase = (str: string) => {
    return str
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Build brand options: exclusively from user catalog
  const catalogBrands = [...new Set(catalog.map((c) => c.brand))].sort();
  const brandOptions = catalogBrands.map((b) => ({ label: b, value: b }));

  // Build sub-brand options: exclusively from user catalog for the selected brand
  const catalogSubBrands = catalog
    .filter((c) => c.brand.toLowerCase() === watchedBrand?.toLowerCase())
    .map((c) => c.sub_brand)
    .sort();
  const subBrandOptions = catalogSubBrands.map((m) => ({ label: m, value: m }));

  async function onSubmit(values: VehicleFormValues) {
    setLoading(true);
    try {
      // Defensive Title Case formatting
      const brand = toTitleCase(values.brand);
      const sub_brand = toTitleCase(values.sub_brand);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No usuario autenticado");

      if (editingVehicle) {
        // Update vehicle
        const { error: vehicleError } = await supabase
          .from("vehicles")
          .update({
            brand,
            sub_brand,
            model_year: values.model_year,
            test_type: values.test_type,
            vehicle_type: values.vehicle_type ?? null,
            traction: showTraction ? values.traction : null,
          })
          .eq("id", editingVehicle.id);

        if (vehicleError) throw vehicleError;
      } else {
        // Create vehicle
        const { error: vehicleError } = await supabase.from("vehicles").insert({
          brand,
          sub_brand,
          model_year: values.model_year,
          test_type: values.test_type,
          vehicle_type: values.vehicle_type ?? null,
          traction: showTraction ? values.traction : null,
          user_id: user.id,
        });

        if (vehicleError) throw vehicleError;
      }

      // Always UPSERT to catalog (it will handle duplicates via UNIQUE constraint)
      const { error: catalogError } = await supabase.from("vehicle_catalog").upsert(
        {
          user_id: user.id,
          brand,
          sub_brand,
        },
        { onConflict: "user_id,brand,sub_brand" },
      );

      if (catalogError) console.error("Error updating catalog:", catalogError);

      // Save brand rule if requested
      if (values.save_as_rule) {
        const { error: ruleError } = await supabase.from("brand_rules").upsert(
          {
            user_id: user.id,
            brand,
            test_type: values.test_type,
          },
          { onConflict: "user_id,brand" },
        );

        if (ruleError) console.error("Error saving rule:", ruleError);
      }

      setOpen(false);
      form.reset();
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al guardar vehículo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val && onSuccess) onSuccess(); // Trigger on close to clear editing state
      }}
    >
      {!editingVehicle && (
        <DrawerTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl"
          >
            <Plus className="h-8 w-8" />
            <span className="sr-only">Nuevo Registro</span>
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-sm flex flex-col overflow-hidden">
          <DrawerHeader>
            <DrawerTitle>
              {editingVehicle ? "Editar Registro" : "Nuevo Registro"}
            </DrawerTitle>
            <DrawerDescription>
              {editingVehicle
                ? "Modifica los datos del vehículo."
                : "Completa los datos del vehículo."}
            </DrawerDescription>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 max-h-[60vh]">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Marca</FormLabel>
                      <Combobox
                        options={brandOptions}
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          // Clear sub_brand when brand changes
                          form.setValue("sub_brand", "");
                        }}
                        placeholder="Buscar o agregar marca..."
                        allowCreate
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sub_brand"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Submarca</FormLabel>
                      <Combobox
                        options={subBrandOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={
                          watchedBrand
                            ? "Buscar o agregar submarca..."
                            : "Primero selecciona una marca"
                        }
                        disabled={!watchedBrand}
                        allowCreate
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo (Año)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="test_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Prueba</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Dinámica">Dinámica</SelectItem>
                          <SelectItem value="Estática">Estática</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicle_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Vehículo</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val as VehicleType);
                          if (val !== "automóvil" && val !== "camioneta") {
                            form.setValue("traction", undefined);
                          }
                        }}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo de vehículo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="automóvil">Automóvil</SelectItem>
                          <SelectItem value="camioneta">Camioneta</SelectItem>
                          <SelectItem value="motocicleta">Motocicleta</SelectItem>
                          <SelectItem value="camión">Camión</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {showTraction && (
                  <FormField
                    control={form.control}
                    name="traction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracción</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo de tracción" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="delantera">Delantera (FWD)</SelectItem>
                            <SelectItem value="trasera">Trasera (RWD)</SelectItem>
                            <SelectItem value="4x4">4x4</SelectItem>
                            <SelectItem value="awd">AWD (Tracción Integral)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!editingVehicle && (
                  <FormField
                    control={form.control}
                    name="save_as_rule"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Marcar marca como{" "}
                            {form.watch("test_type") === "Estática"
                              ? "estática"
                              : "dinámica"}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Se aplicará automáticamente a todos los autos de
                            esta marca en el futuro.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <DrawerFooter className="px-4 py-4">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingVehicle ? "Actualizar Registro" : "Guardar Registro"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
