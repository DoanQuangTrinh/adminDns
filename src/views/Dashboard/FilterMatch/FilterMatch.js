// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import useAxios from "axios-hooks";
import React, { useState, useMemo, memo, useEffect } from "react";
import moment from "moment-timezone";
import "@trendmicro/react-paginations/dist/react-paginations.css";
import { Select } from "@chakra-ui/react";
import { CountryCodeDefault } from "utils/constant";
import { rangeDesc } from "utils/helpers";
import { today } from "utils/helpers";
const leagueApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_LEAGUES;

const codeApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_COUNTRY_CODES;
const initialFilter = {
  country: "",
  league: null,
  // season: new Date().getFullYear() - 1,
  from: today,
  to: moment(today).add(7, "days").tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD"),
  date: undefined,
};
function FilterMatch(props) {
  const { onFilterMatch, filterProps } = props;
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    if (filterProps) {
      setFilter({
        ...filter,
        ...filterProps
      })
    }
  }, [filterProps]);

  const [
    { data: dataLeague, loading: loadingLeague, error: errorLeague },
    refetchLeague,
  ] = useAxios({
    url: leagueApi,
    params: {
      country: filter.country,
    },
  });

  const [
    { data: dataCode, loading: loadingCode, error: errorCode },
    refetchCode,
  ] = useAxios(
    {
      url: codeApi,
    },
    {
      useCache: false
    }
  );
  
  const onChangeFilter = (event, name) => {
    setFilter({
      ...filter,
      [name]: event.target.value
    })
  };

  // const seasons = useMemo(() => {
  //   const currentSeason = new Date().getFullYear() - 1;
  //   const result = rangeDesc(currentSeason, 1990);
  //   return result;
  // }, []);

  const onFilter = () => {
    const newFilter = {
      ...filter,
      date: undefined
    }
    onFilterMatch(newFilter);
  }

  return (
    <>
      <Flex direction="row" columnGap={3} mb={3}>
        <FormControl>
          <FormLabel>Country</FormLabel>
          <Select
            placeholder="Select Country"
            onChange={(e) => {
              // onChangeFilter(e, "country");
              setFilter({
                ...filter,
                league: "",
                country: e.target.value,
              });
            }}
            value={filter.country}
          >
            {dataCode?.data?.length
              ? dataCode.data.map((code) => (
                  <option key={code._id} value={code.name} fontWeight={500}>
                    {code.name}
                  </option>
                ))
              : "No code"}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>League</FormLabel>
          <Select
            placeholder="Select League"
            onChange={(e) => onChangeFilter(e, "league")}
            value={filter.league}
          >
            {dataLeague?.data?.length
              ? dataLeague.data.map((league) => (
                  <option
                    key={league?.league?.id}
                    value={league?.league?.id}
                    fontWeight={500}
                  >
                    {league?.league?.name}
                  </option>
                ))
              : "No code"}
          </Select>
        </FormControl>
      </Flex>
      <Flex direction="row" columnGap={3} mb={3}>
        <FormControl>
          <FormLabel>From</FormLabel>
          <Input
            placeholder="From"
            size="md"
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={(e) => onChangeFilter(e, "from")}
            value={filter.from || ""}
            errorBorderColor="red.300"
            min={new Date().toISOString().split("T")[0]}
          />
        </FormControl>
        <FormControl>
          <FormLabel fontWeight={500}>To</FormLabel>
          <Input
            placeholder="To"
            size="md"
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={(e) => onChangeFilter(e, "to")}
            value={filter.to || ""}
            errorBorderColor="red.300"
            min={new Date().toISOString().split("T")[0]}
          />
        </FormControl>
      </Flex>
      <Flex direction="row" columnGap={3} mb={3} justifyContent={"flex-end"}>
        <Button onClick={() => {
          setFilter(initialFilter)
          onFilterMatch(initialFilter);
        }}>Reset</Button>
        <Button
          disabled={
            !filter.country ||
            !filter.league ||
            !filter.to ||
            !filter.from 
            // !filter.season
          }
          colorScheme="red"
          onClick={() => {
            onFilter();
          }}
        >
          Filter
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => {
            const newFilter = {
              country: undefined,
              league: undefined,
              // season: undefined,
              from: undefined,
              to: undefined,
              date: moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD"),
            };
            onFilterMatch(newFilter);
          }}
        >
          Matches on Today
        </Button>
      </Flex>
    </>
  );
}

export default FilterMatch;
