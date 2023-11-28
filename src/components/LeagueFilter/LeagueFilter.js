// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import "@trendmicro/react-paginations/dist/react-paginations.css";

import { today } from "utils/helpers";
import useAxios from "axios-hooks";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";

function LeagueFilter(props) {
  const bgColor = useColorModeValue("blue.200", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", { textColor });

  const { onFilterLeague, filterProps } = props;
  const [selectedLeague, setSelectedLeague] = useState();

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: ROOT_API + API_ROUTES.LEAGUES_FILTER,
    },
    {
      useCache: false,
    }
  );
  useEffect(() => {
    if (filterProps) {
      setSelectedLeague(filterProps.league_id);
    }
  }, [filterProps]);

  const changeLeague = (league) => {
    if (selectedLeague === league.leagueId) {
      setSelectedLeague("");
      onFilterLeague("");
    } else {
      setSelectedLeague(league.leagueId);
      onFilterLeague(league.leagueId);
    }
  };

  const leagueViews = () => {
    const leagues = data?.data?.map((league, index) => {
      return (
        <Flex
          key={index}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          bg={selectedLeague === league.leagueId ? bgColor : borderColor}
          borderRadius={"8px"}
          py={2}
          px={2}
          cursor={"pointer"}
          onClick={() => changeLeague(league)}
          whiteSpace={"pre-wrap"}
          minW={100}
        >
          <Text fontWeight={"bold"} color={textColor}>
            {league.name}
          </Text>
        </Flex>
      );
    });
    return leagues;
  };
  return (
    <>
      <Flex
        direction="row"
        columnGap={3}
        mb={3}
        flexWrap={"wrap"}
        rowGap={3}
        justifyContent={"center"}
      >
        {leagueViews()}
      </Flex>
    </>
  );
}

export default LeagueFilter;
