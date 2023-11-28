import React from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import DatePicker from "../DatePicker/DatePicker";

const DatePickerController = ({
  name,
  label,
  control,
  styleContainer,
  styleBoxInput,
  isRequired,
  showTimeSelect,
  dateFormat,
  timeFormat,
  timeIntervals,
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
          <FormLabel minW="150px" htmlFor="">
            {label}
          </FormLabel>
        )}
        <Box {...styleBoxInput}>
          <DatePicker
            placeholderText="Select date"
            dateFormat={dateFormat}
            showTimeSelect={showTimeSelect}
            selectedDate={field.value}
            timeFormat={timeFormat}
            timeIntervals={timeIntervals}
            onChange={(date) => {
              field.onChange(date);
              onChange?.(date);
            }}
          />
          <FormErrorMessage>{error && error?.message}</FormErrorMessage>
        </Box>
      </FormControl>
    )}
  />
);

export default DatePickerController;
