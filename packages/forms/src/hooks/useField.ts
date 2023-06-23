import { useFieldContext } from "../components/common/Field";
import { get, useFormContext } from "react-hook-form";
import { useState, useMemo, useEffect } from "react";
import { useFormNamespace } from "../components/contexts/FormNamespace";
import { FieldProps } from "../contracts";

export function useField<T extends FieldProps>(incomingField?: Partial<T>) {
  const { field: contextField } = useFieldContext();
  const field = { ...incomingField, ...contextField } as FieldProps;
  const form = useFormContext();
  const { namespaces } = useFormNamespace();
  const [value, setValue] = useState<T["defaultValue"]>(
    field?.defaultValue as any
  );
  const label = useMemo(() => {
    if (!field?.label) {
      return field?.name;
    }

    return field.label;
  }, [field?.label]);

  const name = useMemo(() => {
    if (!namespaces || namespaces.length <= 0) field.name;
    return [...(namespaces || []), field.name].filter((v) => !!v).join(".");
  }, [namespaces, field.name]);

  const change = (nextValue: T["defaultValue"]) => {
    // setValue(() => nextValue);
    console.log("change", {
      nextValue,
      form,
      win: typeof window,
    });
    form.setValue(name, nextValue);
    // field?.onChange?.(nextValue);
  };

  useEffect(() => {
    change(field?.defaultValue);
  }, []);

  // useEffect(() => {
  //   if (field) {
  //     // setValue(() => field.incomingValue);
  //   }
  // }, [field?.incomingValue]);

  useEffect(() => {
    const subscription = form.watch(
      (formValue, { name: fieldName, type, ...rest }) => {
        if (fieldName === name) {
          const nextValue = get(formValue, fieldName);
          // console.log({ name, value: nextValue });
          setValue(() => nextValue);
        }
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    change,
    value,
    label,
    name,
    ...form,
  };
}
