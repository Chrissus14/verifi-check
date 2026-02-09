"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  type VehicleFormValues,
  type BrandRule,
} from "@/types/vehicle";
import { SMART_RULES } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";

interface VehicleFormProps {
  editingVehicle?: Vehicle | null;
  onSuccess?: () => void;
}

export function VehicleForm({ editingVehicle, onSuccess }: VehicleFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brandRules, setBrandRules] = useState<BrandRule[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema) as any,
    defaultValues: {
      brand: "",
      sub_brand: "",
      model_year: new Date().getFullYear(),
      test_type: "Dinámica",
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
        save_as_rule: false,
      });
    }
  }, [open, editingVehicle, form]);

  // Fetch user brand rules
  useEffect(() => {
    async function fetchRules() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("brand_rules")
        .select("*")
        .eq("user_id", user.id);

      if (data) setBrandRules(data);
    }

    if (open) {
      fetchRules();
    }
  }, [open, supabase]);

  // Smart Logic
  const watchedBrand = form.watch("brand");
  const watchedSubBrand = form.watch("sub_brand");

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

      // 2. Fallback to predefined SMART_RULES
      let rule = SMART_RULES.find(
        (r) =>
          r.brand.toLowerCase() === watchedBrand.toLowerCase() &&
          r.sub_brand?.toLowerCase() === watchedSubBrand?.toLowerCase(),
      );

      if (!rule) {
        rule = SMART_RULES.find(
          (r) =>
            r.brand.toLowerCase() === watchedBrand.toLowerCase() &&
            r.sub_brand === undefined,
        );
      }

      if (rule) {
        form.setValue("test_type", rule.type);
      }
    }
  }, [watchedBrand, watchedSubBrand, form, brandRules, editingVehicle]);

  async function onSubmit(data: VehicleFormValues) {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No usuario autenticado");

      if (editingVehicle) {
        // Update vehicle
        const { error: vehicleError } = await supabase
          .from("vehicles")
          .update({
            brand: data.brand,
            sub_brand: data.sub_brand,
            model_year: data.model_year,
            test_type: data.test_type,
          })
          .eq("id", editingVehicle.id);

        if (vehicleError) throw vehicleError;
      } else {
        // Create vehicle
        const { error: vehicleError } = await supabase.from("vehicles").insert({
          brand: data.brand,
          sub_brand: data.sub_brand,
          model_year: data.model_year,
          test_type: data.test_type,
          user_id: user.id,
        });

        if (vehicleError) throw vehicleError;
      }

      // Save brand rule if requested
      if (data.save_as_rule) {
        const { error: ruleError } = await supabase.from("brand_rules").upsert(
          {
            user_id: user.id,
            brand: data.brand,
            test_type: data.test_type,
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
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Renault" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sub_brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submarca</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Kwid" {...field} />
                      </FormControl>
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
