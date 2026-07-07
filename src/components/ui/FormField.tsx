import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";
import type { FieldError } from "react-hook-form";

type FormFieldProps = Omit<TextFieldProps, "error"> & {
  fieldError?: FieldError;
};

export const FormField = ({
  fieldError,
  helperText,
  slotProps,
  ...props
}: FormFieldProps) => (
  <TextField
    {...props}
    error={!!fieldError}
    helperText={fieldError?.message ?? helperText}
    slotProps={{
      ...slotProps,
      formHelperText: {
        style: { margin: "2px 0 8px" },
        ...(slotProps?.formHelperText as object),
      },
    }}
  />
);
