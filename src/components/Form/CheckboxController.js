import React from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";

const CheckboxController = ({
  name,
  label,
  control,
  styleContainer,
  styleBoxInput,
  isRequired,
  disabled,
  content,
  minWLabel = "150px",
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
        {label && (
          <FormLabel minW={minWLabel} htmlFor={name}>
            {label}
          </FormLabel>
        )}
        <Box {...styleBoxInput}>
          <Checkbox
            id={name}
            textTransform="capitalize"
            ref={field.ref}
            isChecked={field.value}
            disabled={disabled}
            onChange={field.onChange}
          >
            {content}
          </Checkbox>
          <FormErrorMessage>{error && error?.message}</FormErrorMessage>
        </Box>
      </FormControl>
    )}
  />
);

export default CheckboxController;
