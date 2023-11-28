import React from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";

const SelectController = ({
  name,
  label,
  control,
  styleContainer,
  styleBoxInput,
  isRequired,
  placeholder,
  options,
  onChange,
  ...props
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
          <Select
            {...field}
            {...props}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e);
            }}
            onBlur={field.onBlur}
            options={options}
            placeholder={placeholder || "Choose"}
            chakraStyles={{
              menu: (provided, state) => ({
                ...provided,
                zIndex: 10,
              }),
            }}
          />
          <FormErrorMessage>{error && error?.message}</FormErrorMessage>
        </Box>
      </FormControl>
    )}
  />
);

export default SelectController;
