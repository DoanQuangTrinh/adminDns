import React from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as InputComponent,
  Textarea,
} from "@chakra-ui/react";

const InputController = ({
  type = "text",
  name,
  label,
  control,
  styleContainer,
  styleBoxInput,
  isRequired,
  disabled,
  onChange,
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <FormControl
        {...styleContainer}
        isRequired={isRequired}
        isInvalid={error && error?.message}
      >
        {label && <FormLabel minW="150px">{label}</FormLabel>}
        <Box {...styleBoxInput}>
          {type === "area" ? (
            <Textarea
              {...field}
              type={type}
              disabled={disabled}
              onChange={(e) => {
                onChange?.(e);
                field.onChange(e);
              }}
            />
          ) : (
            <InputComponent
              {...field}
              type={type}
              disabled={disabled}
              onChange={(e) => {
                onChange?.(e);
                field.onChange(e);
              }}
            />
          )}
          <FormErrorMessage>{error && error?.message}</FormErrorMessage>
        </Box>
      </FormControl>
    )}
  />
);

export default InputController;
