import { forwardRef } from "react";
import { Input } from "@chakra-ui/react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InputCustom = forwardRef(({ value, onClick }, ref) => (
  <Input
    className="example-custom-input"
    onClick={onClick}
    ref={ref}
    value={value}
  />
));

const DatePicker = ({
  dateFormat = "dd-MM-yyyy",
  selectedDate,
  onChange,
  ...props
}) => {
  return (
    <ReactDatePicker
      dateFormat={dateFormat}
      selected={selectedDate}
      customInput={<InputCustom />}
      onChange={(date) => onChange(date)}
      {...props}
    />
  );
};

export default DatePicker;
