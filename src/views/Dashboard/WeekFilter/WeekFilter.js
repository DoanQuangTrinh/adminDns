// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import "@trendmicro/react-paginations/dist/react-paginations.css";

import { today } from "utils/helpers";

function WeekFilter(props) {
  const bgColor = useColorModeValue("blue.200", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", { textColor });

  const { onFilterMatch, filterProps } = props;
  const [selectedDate, setSelectedDate] = useState(today);
  useEffect(() => {
    if (filterProps) {
      setSelectedDate(filterProps.date);
    }
  }, [filterProps]);

  const changeDateInWeek = (date) => {
    setSelectedDate(date);
    // const newFilter = {
    //   ...filter,
    //   date,
    // };
    onFilterMatch(date);
  };

  const calendarViews = () => {
    const weekDays = Array.from(Array(7).keys());
    const dayInWeek = weekDays.map((day, index) => {
      const newDate = moment(today, "YYYY-MM-DD")
        .add(day, "days")
        .format("dddd YYYY-MM-DD");
      return (
        <Flex
          key={index}
          flex={1}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          bg={
            selectedDate === newDate.split(" ")?.at(1) ? bgColor : borderColor
          }
          borderRadius={"8px"}
          py={2}
          cursor={"pointer"}
          onClick={() => changeDateInWeek(newDate.split(" ")?.at(1))}
        >
          <Text fontWeight={"bold"} color={textColor}>
            {newDate.split(" ")?.at(1)}
          </Text>
          <Text fontWeight={"bold"} color={textColor}>
            {newDate.split(" ")?.at(0)}
          </Text>
        </Flex>
      );
    });
    return dayInWeek;
  };
  return (
    <>
      <Flex direction="row" columnGap={3} mb={3}>
        {calendarViews()}
      </Flex>
    </>
  );
}

export default WeekFilter;
