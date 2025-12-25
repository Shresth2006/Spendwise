import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "./label"; // Ensure you have the Native Label component

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

/**
 * FormItem provides the layout wrapper for each field (Label + Input + Message)
 */
function FormItem({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={[styles.formItem, style]}>
        {children}
      </View>
    </FormItemContext.Provider>
  );
}

function FormLabel({ style, ...props }: any) {
  const { error } = useFormField();

  return (
    <Label
      style={[
        style,
        error ? { color: "#ef4444" } : null // text-destructive if error
      ]}
      {...props}
    />
  );
}

/**
 * In Native, FormControl is a simple wrapper. 
 * We don't use Slot here; instead, we pass children directly.
 */
function FormControl({ children }: { children: React.ReactNode }) {
  return <View style={styles.formControl}>{children}</View>;
}

function FormDescription({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return (
    <Text style={[styles.description, style]}>
      {children}
    </Text>
  );
}

function FormMessage({ children, style }: { children?: React.ReactNode; style?: TextStyle }) {
  const { error } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) return null;

  return (
    <Text style={[styles.message, style]}>
      {body}
    </Text>
  );
}

const styles = StyleSheet.create({
  formItem: {
    width: "100%",
    marginBottom: 16,
    gap: 4,
  },
  formControl: {
    width: "100%",
  },
  description: {
    fontSize: 12,
    color: "#64748b", // muted-foreground
    marginTop: 2,
  },
  message: {
    fontSize: 12,
    color: "#ef4444", // destructive
    fontWeight: "500",
    marginTop: 2,
  },
});

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};