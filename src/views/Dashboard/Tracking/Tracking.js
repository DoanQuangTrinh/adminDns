import {
    Button,
    Flex,
    Table,
    Tbody,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useDisclosure,
    Select,
  } from "@chakra-ui/react";
  import useAxios from "axios-hooks";
  import Card from "components/Card/Card.js";
  import CardBody from "components/Card/CardBody.js";
  import CardHeader from "components/Card/CardHeader";
  import ListTracking from "components/Tracking/ListTracking";
  import React, { useState, useEffect } from "react";
  import { API_ROUTES , ROOT_API } from "utils/constant";
  import { TablePagination } from "@trendmicro/react-paginations";
  import { initialFilter } from "utils/constant";
  import { useLocation } from "react-router-dom";
  import { axiosGet } from "utils/api";
  
  
  const Tracking = () => {
    const [filter, setFilter] = useState(initialFilter);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isRegisterOpen = isOpen;
    const onRegisterOpen = onOpen;
    const onRegisterClose = onClose;
    const trackingApi = ROOT_API + API_ROUTES.LIST_TRACKING ;
    const location = useLocation();
    const spliceSubDomain = location.pathname.match(/\/subDomain\/([^/]+)\//);
    const subDomainId = spliceSubDomain[1]
    const [{ data, loading, error }, refetch] = useAxios({
      url: `${trackingApi}/${subDomainId}`,
    });
    const tracking = data?.data
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const handleEditClick = (row) => {
        setSelectedRow(row);
        setIsEditModalOpen(true);
    };
    const [exporting, setExporting] = useState(false);

  const handleExportTracking = async () => {
    setExporting(true);
  
    try {
      const { data } = await axiosGet(`${trackingApi}/${subDomainId}/export`, {
        params: filter,
        responseType: 'blob',
      });
      console.log(data)
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'exportedTracking.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false); 
    }
  };
  
    return (
        <>
      <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
          <CardHeader p="6px 0px 22px 0px">
            <Button
              variant="primary"
              maxH="30px"
              m="10px"
              onClick={() => {
                handleExportTracking();
              }}
              isLoading={exporting} 
            >
              Export
            </Button>
            <Select maxWidth="10%" 
              maxH="30px"
              m="10px" placeholder='All'>
              <option value='option1'>Option 1</option>
              <option value='option1'>Option 2</option>
            </Select>
            <Select maxWidth="10%" 
              maxH="30px"
              m="10px" placeholder='Uniqued'>
              <option value='option1'>IP</option>
              <option value='option1'>Nation</option>
            </Select>
        </CardHeader>
          <CardBody>
            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr my=".8rem" pl="0px" color="gray.400">
                  <Th borderColor={borderColor} color="gray.400">
                  IP
                  </Th>
                  <Th borderColor={borderColor} textAlign="center" color="gray.400">
                  Nation
                  </Th>
                  <Th borderColor={borderColor}></Th>
                  <Th borderColor={borderColor} textAlign="center" color="gray.400">
                  Quantity
                  </Th>
                  <Th borderColor={borderColor}></Th>
                  <Th borderColor={borderColor} textAlign="center" color="gray.400">
                  StartDate
                  </Th>
                  <Th borderColor={borderColor}></Th>
                </Tr>
              </Thead>
              <Tbody>
                  {tracking?.map((row, index, arr) => (
                    <ListTracking
                      quantity={1}
                      key={row._id}
                      id={row._id}
                      subdomain={row.subdomain}
                      ip={row.ip}
                      startday={row.createdAt}
                      nation={row.nation}
                      refetch = {refetch}
                      onClick={() => handleEditClick(row)}
                    />
                    ))}
                </Tbody>
            </Table>
            <Flex justifyContent={"flex-end"}>
              <TablePagination
                  type="full"
                  page={data?.pagination?.page}
                  pageLength={data?.pagination?.pageSize}
                  totalRecords={data?.pagination?.count}
                  onPageChange={({ page, pageLength }) => {
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
    </>
    )
  }
  
  export default Tracking;