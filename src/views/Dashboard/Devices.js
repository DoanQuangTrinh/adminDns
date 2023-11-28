// Chakra imports
import {
  Flex,
  Table,
  Button,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import DevicesTableRow from "components/Devices/DevicesTableRow";
import React, { useEffect, useState } from "react";
import { tablesTableData } from "variables/general";
import useAxios from "axios-hooks";
import { checkLogin, logout, getToken } from "../../utils/authentication";
// import AddLinkDialog from "components/Links/AddLinkDialog";
import AddDeviceDialog from "components/Devices/AddDeviceDialog";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";

const devicesApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_DEVICES;

function Devices() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const xToken = getToken();
  const [devices, setDevices] = React.useState([]);
  const [filter, setFilter] = useState(initialFilter);
  const [{ data, loading, error }, refetch] = useAxios({
    url: devicesApi,
    headers: {
      xToken,
    },
    params: filter
  });

  const {
    isOpen: isAddDeviceOpen,
    onOpen: onAddDeviceOpen,
    onClose: onAddDeviceClose,
  } = useDisclosure();

  const fetchData = () => {
    refetch();
  };

  useEffect(() => {
    if (data == undefined) {
      refetch;
    }
    setDevices(data?.data);
  }, [data, setDevices]);

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Devices Table
          </Text>
          {/* <Button
            variant="primary"
            maxH="30px"
            m="10px"
            onClick={onAddDeviceOpen}
          >
            Add
          </Button> */}
        </CardHeader>
        <AddDeviceDialog
          isOpen={isAddDeviceOpen}
          onOpen={onAddDeviceOpen}
          onClose={onAddDeviceClose}
          // data={props}
        />
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Name Device
                </Th>
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Localtion
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Active
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Status
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Notes
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Edit
                </Th>

                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {devices?.map((row, index, arr) => {
                return (
                  <DevicesTableRow
                    _id={row._id}
                    name={row.name}
                    active={row.active}
                    location={row.location}
                    status={row.status}
                    notes={row.notes}
                    isLast={index === arr.length - 1 ? true : false}
                    key={index}
                  />
                );
              })}
            </Tbody>
          </Table>
          <Flex justifyContent="flex-end">
            <TablePagination
              type="full"
              page={data?.pagination?.page}
              pageLength={data?.pagination?.pageSize}
              totalRecords={data?.pagination?.count}
              onPageChange={({ page, pageLength }) => {
                console.log(page);
                setFilter({
                  ...filter,
                  pageSize: pageLength,
                  pageIndex: page - 1,
                });
              }}
              prevPageRenderer={() => <i className="fa fa-angle-left" />}
              nextPageRenderer={() => <i className="fa fa-angle-right" />}
            />
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Devices;
