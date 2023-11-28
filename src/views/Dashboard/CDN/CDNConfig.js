// Chakra imports
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
  useToast,
} from "@chakra-ui/react";
// Custom components
import useAxios from "axios-hooks";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect } from "react";
import Loading from "components/Layout/Loading";
import moment from "moment-timezone";
import { initialFilter } from "utils/constant";
import { TablePagination } from "@trendmicro/react-paginations";
import CDNRow from "components/CDN/CDNRow";
import { axiosPost } from "utils/api";
import AddNewLinkDialog from "components/CDN/AddNewLinkDialog";

const cdnLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CDN_LINKS;
const cdnLinkUpdateApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CDN_CREATE_CDN_LINKS;

function CDNConfig() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [filter, setFilter] = useState(initialFilter);
  const [loadingImport, setLoadingImport] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ data, loading, error }, refetch] = useAxios({
    url: cdnLinkApi,
    params: filter,
  });
  const onUpdateCDNLink = async () => {
    if (
      window.confirm(
        "Are you sure to generate link CDN, the current link will be removed ?"
      )
    ) {
      setLoadingImport(true);
      try {
        const response = await axiosPost(cdnLinkUpdateApi, undefined);
        if (response?.data?.code == 0) {
          toast({
            title: "Generate Link Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          refetch();
        }
        setLoadingImport(false);
      } catch (error) {
        console.log(error);
        toast({
          title:
            error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg ||
            "Generate Link Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setLoadingImport(false);
      }
    }
  };
  const onCreateCDNLink = () => {
    onOpen();
  };
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            CDN Links
          </Text>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Loading />
          ) : (
            <>
              <Flex mb={3} columnGap={3}>
                <Button
                  colorScheme="red"
                  onClick={onUpdateCDNLink}
                  disabled={loadingImport}
                >
                  Auto Generate CND Links
                </Button>
                <Button colorScheme="blue" onClick={onCreateCDNLink}>
                  Add New Link
                </Button>
              </Flex>
              <Flex overflow={"auto"}>
                <Table variant="simple" color={textColor}>
                  <Thead>
                    <Tr my=".8rem" pl="0px" color="gray.400">
                      <Th
                        borderColor={borderColor}
                        color="gray.400"
                        maxWidth="300px"
                      >
                        CDN Link
                      </Th>
                      <Th
                        borderColor={borderColor}
                        color="gray.400"
                        maxWidth="300px"
                      >
                        Backup Link
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Created At
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.data?.map((row, index, arr) => {
                      return (
                        <CDNRow
                          data={row}
                          id={row._id}
                          fetchData={refetch}
                          isLast={index === arr.length - 1 ? true : false}
                        />
                      );
                    })}
                  </Tbody>
                </Table>
              </Flex>
              <Flex justifyContent="flex-end" mt="10px">
                <TablePagination
                  type="full"
                  page={data?.pagination?.page}
                  pageLength={data?.pagination?.pageSize}
                  totalRecords={data?.pagination?.count}
                  onPageChange={({ page, pageLength }) => {
                    // console.log(page);
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
            </>
          )}
        </CardBody>
      </Card>
      <AddNewLinkDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fetchData={refetch}
        // data={rowDomain}
      />
    </Flex>
  );
}

export default CDNConfig;
