// Chakra imports
import React, { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
import IconBox from "components/Icons/IconBox";
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
  PersonIcon,
  ProfileIcon,
} from "components/Icons/Icons.js";
// import React from "react";
// Variables
import { pageVisits, socialTraffic } from "variables/general";

import { checkLogin } from "../../utils/authentication";
import { useHistory } from "react-router-dom";
import useAxios from "axios-hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";

const dashboardApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_SUMMARY;

export default function Dashboard() {
  // Chakra Color Mode
  const iconBlue = useColorModeValue("blue.500", "blue.500");
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textTableColor = useColorModeValue("gray.500", "white");

  const { colorMode } = useColorMode();

  const isLoggedIn = checkLogin();
  const history = useHistory();

  const [{ data, loading, error }, refetch] = useAxios({
    url: dashboardApi,
  });

  const [{ data: liveMatchesMonthly }, refetchLiveMatch] = useAxios({
    url: ROOT_API + API_ROUTES.LIVE_MATCHES_MONTHLY,
  });
  const [{ data: viewersMonthly }, refetchViewer] = useAxios({
    url: ROOT_API + API_ROUTES.VIEWERS_MONTHLY,
  });
  const barChartData = useMemo(() => {
    const qty = viewersMonthly?.data?.length
      ? viewersMonthly.data.map((month) => month.qty)
      : [];
    const data = [
      {
        name: "Quantity Viewer Monthly",
        data: qty,
      },
    ];
    return data;
  }, [viewersMonthly?.data]);

  const barChartOptions = useMemo(() => {
    const options = {
      chart: {
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        theme: "dark",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            colors: "#A0AEC0",
            fontSize: "12px",
          },
        },
        show: true,
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        show: true,
        color: "#A0AEC0",
        labels: {
          show: true,
          style: {
            colors: "#A0AEC0",
            fontSize: "14px",
          },
        },
      },
      fill: {
        colors: "#ED8936",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 5,
      },
      plotOptions: {
        bar: {
          borderRadius: 15,
          columnWidth: "15px",
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 0,
              },
            },
          },
        },
      ],
    };
    return options;
  }, [])
  const lineChartData = useMemo(() => {
    const qty = liveMatchesMonthly?.data?.length ? liveMatchesMonthly.data.map(month => month.qty) : []
    const data = [
      {
        name: "Quantity Live Match Monthly",
        data: qty,
      },
    ];
    return data;
  }, [liveMatchesMonthly?.data]);

  const lineChartOptions = useMemo(() => {
    const options = {
      chart: {
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        theme: "light",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#fff",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#fff",
            fontSize: "12px",
          },
        },
      },
      legend: {
        show: false,
      },
      grid: {
        strokeDashArray: 5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.5,
          inverseColors: true,
          opacityFrom: 0.8,
          opacityTo: 0,
          stops: [],
        },
        colors: ["#fff", "#3182CE"],
      },
      colors: ["#fff", "#3182CE"],
    };
    return options;
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return history.push("/auth/signin");
    }
  }, [isLoggedIn, history]);

  return (
    <>
      <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
        <SimpleGrid columns={{ sm: 1, md: 3, xl: 3 }} spacing="24px" mb="20px">
          <Card minH="125px">
            <Flex direction="column">
              <Flex
                flexDirection="row"
                align="center"
                justify="center"
                w="100%"
                mb="25px"
              >
                <Stat me="auto">
                  <StatLabel
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Total Member
                  </StatLabel>
                  <Flex>
                    <StatNumber
                      fontSize="lg"
                      color={textColor}
                      fontWeight="bold"
                    >
                      {data?.data?.memberSummary?.totalMember}
                    </StatNumber>
                  </Flex>
                </Stat>
                <IconBox
                  borderRadius="50%"
                  as="box"
                  h={"45px"}
                  w={"45px"}
                  bg={iconBlue}
                >
                  <PersonIcon h={"24px"} w={"24px"} color={iconBoxInside} />
                </IconBox>
              </Flex>
              <Text color="gray.400" fontSize="sm">
                <Text as="span" color="green.400" fontWeight="bold">
                  {data?.data?.memberSummary?.ratioIncreaseMember > 0
                    ? "+" + data?.data?.memberSummary?.ratioIncreaseMember
                    : data?.data?.memberSummary?.ratioIncreaseMember < 0
                    ? "-" + data?.data?.memberSummary?.ratioIncreaseMember
                    : 0}
                  %{" "}
                </Text>
                Since last month
              </Text>
            </Flex>
          </Card>
          <Card minH="125px">
            <Flex direction="column">
              <Flex
                flexDirection="row"
                align="center"
                justify="center"
                w="100%"
                mb="25px"
              >
                <Stat me="auto">
                  <StatLabel
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Total Match Livestream
                  </StatLabel>
                  <Flex>
                    <StatNumber
                      fontSize="lg"
                      color={textColor}
                      fontWeight="bold"
                    >
                      {data?.data?.matchLiveSummary?.totalMatchLive}
                    </StatNumber>
                  </Flex>
                </Stat>
                <IconBox
                  borderRadius="50%"
                  as="box"
                  h={"45px"}
                  w={"45px"}
                  bg={iconBlue}
                >
                  <Text
                    color="white"
                    textTransform={"uppercase"}
                    fontWeight={900}
                  >
                    LIVE
                  </Text>
                </IconBox>
              </Flex>
              <Text color="gray.400" fontSize="sm">
                <Text as="span" color="green.400" fontWeight="bold">
                  {data?.data?.matchLiveSummary?.ratioIncreaseMatchLive > 0
                    ? "+" + data?.data?.matchLiveSummary?.ratioIncreaseMatchLive
                    : data?.data?.matchLiveSummary?.ratioIncreaseMatchLive < 0
                    ? "-" + data?.data?.matchLiveSummary?.ratioIncreaseMatchLive
                    : 0}
                  %{" "}
                </Text>
                Since last month
              </Text>
            </Flex>
          </Card>
          <Card minH="125px">
            <Flex direction="column">
              <Flex
                flexDirection="row"
                align="center"
                justify="center"
                w="100%"
                mb="25px"
              >
                <Stat me="auto">
                  <StatLabel
                    fontSize="xs"
                    color="gray.400"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Total Viewer Livestream
                  </StatLabel>
                  <Flex>
                    <StatNumber
                      fontSize="lg"
                      color={textColor}
                      fontWeight="bold"
                    >
                      {data?.data?.viewerLiveSummary?.totalViewerLive}
                    </StatNumber>
                  </Flex>
                </Stat>
                <IconBox
                  borderRadius="50%"
                  as="box"
                  h={"45px"}
                  w={"45px"}
                  bg={iconBlue}
                >
                  {/* <ViewIcon h={"24px"} w={"24px"} color={iconBoxInside} /> */}
                  <Text
                    color="white"
                    textTransform={"uppercase"}
                    fontWeight={900}
                  >
                    VIEW
                  </Text>
                </IconBox>
              </Flex>
              <Text color="gray.400" fontSize="sm">
                <Text as="span" color="green.400" fontWeight="bold">
                  {data?.data?.viewerLiveSummary?.ratioIncreaseViewerLive > 0
                    ? "+" +
                      data?.data?.viewerLiveSummary?.ratioIncreaseViewerLive
                    : data?.data?.viewerLiveSummary?.ratioIncreaseViewerLive < 0
                    ? "-" +
                      data?.data?.viewerLiveSummary?.ratioIncreaseViewerLive
                    : 0}
                  %{" "}
                </Text>
                Since last month
              </Text>
            </Flex>
          </Card>
        </SimpleGrid>
        <Grid
          templateColumns={{ sm: "1fr", lg: "2fr 1fr" }}
          templateRows={{ lg: "repeat(2, auto)" }}
          gap="20px"
        >
          <Card
            bg={
              colorMode === "dark"
                ? "navy.800"
                : "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
            }
            p="0px"
            maxW={{ sm: "320px", md: "100%" }}
          >
            <Flex direction="column" mb="40px" p="28px 0px 0px 22px">
              <Text color="#fff" fontSize="lg" fontWeight="bold" mb="6px">
                Live Matches Overview in {new Date().getFullYear()}
              </Text>
            </Flex>
            <Box minH="300px">
              <LineChart
                chartData={lineChartData}
                chartOptions={lineChartOptions}
              />
            </Box>
          </Card>
          <Card p="0px" maxW={{ sm: "320px", md: "100%" }}>
            <Flex direction="column" mb="40px" p="28px 0px 0px 22px">
              <Text color={textColor} fontSize="lg" fontWeight="bold">
                Viewers Overview in {new Date().getFullYear()}
              </Text>
            </Flex>
            <Box minH="300px">
              <BarChart
                chartData={barChartData}
                chartOptions={barChartOptions}
              />
            </Box>
          </Card>
          {/* <Card p="0px" maxW={{ sm: "320px", md: "100%" }}>
            <Flex direction="column">
              <Flex align="center" justify="space-between" p="22px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Page visits
                </Text>
                <Button variant="primary" maxH="30px">
                  SEE ALL
                </Button>
              </Flex>
              <Box overflow={{ sm: "scroll", lg: "hidden" }}>
                <Table>
                  <Thead>
                    <Tr bg={tableRowColor}>
                      <Th color="gray.400" borderColor={borderColor}>
                        Page name
                      </Th>
                      <Th color="gray.400" borderColor={borderColor}>
                        Visitors
                      </Th>
                      <Th color="gray.400" borderColor={borderColor}>
                        Unique users
                      </Th>
                      <Th color="gray.400" borderColor={borderColor}>
                        Bounce rate
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pageVisits.map((el, index, arr) => {
                      return (
                        <Tr key={index}>
                          <Td
                            color={textTableColor}
                            fontSize="sm"
                            fontWeight="bold"
                            borderColor={borderColor}
                            border={index === arr.length - 1 ? "none" : null}
                          >
                            {el.pageName}
                          </Td>
                          <Td
                            color={textTableColor}
                            fontSize="sm"
                            border={index === arr.length - 1 ? "none" : null}
                            borderColor={borderColor}
                          >
                            {el.visitors}
                          </Td>
                          <Td
                            color={textTableColor}
                            fontSize="sm"
                            border={index === arr.length - 1 ? "none" : null}
                            borderColor={borderColor}
                          >
                            {el.uniqueUsers}
                          </Td>
                          <Td
                            color={textTableColor}
                            fontSize="sm"
                            border={index === arr.length - 1 ? "none" : null}
                            borderColor={borderColor}
                          >
                            {el.bounceRate}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            </Flex>
          </Card>
          <Card p="0px" maxW={{ sm: "320px", md: "100%" }}>
            <Flex direction="column">
              <Flex align="center" justify="space-between" p="22px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Social traffic
                </Text>
                <Button variant="primary" maxH="30px">
                  SEE ALL
                </Button>
              </Flex>
            </Flex>
            <Box overflow={{ sm: "scroll", lg: "hidden" }}>
              <Table>
                <Thead>
                  <Tr bg={tableRowColor}>
                    <Th color="gray.400" borderColor={borderColor}>
                      Referral
                    </Th>
                    <Th color="gray.400" borderColor={borderColor}>
                      Visitors
                    </Th>
                    <Th color="gray.400" borderColor={borderColor}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {socialTraffic.map((el, index, arr) => {
                    return (
                      <Tr key={index}>
                        <Td
                          color={textTableColor}
                          fontSize="sm"
                          fontWeight="bold"
                          borderColor={borderColor}
                          border={index === arr.length - 1 ? "none" : null}
                        >
                          {el.referral}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize="sm"
                          borderColor={borderColor}
                          border={index === arr.length - 1 ? "none" : null}
                        >
                          {el.visitors}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize="sm"
                          borderColor={borderColor}
                          border={index === arr.length - 1 ? "none" : null}
                        >
                          <Flex align="center">
                            <Text
                              color={textTableColor}
                              fontWeight="bold"
                              fontSize="sm"
                              me="12px"
                            >{`${el.percentage}%`}</Text>
                            <Progress
                              size="xs"
                              colorScheme={el.color}
                              value={el.percentage}
                              minW="120px"
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </Card> */}
        </Grid>
      </Flex>
    </>
  );
}
