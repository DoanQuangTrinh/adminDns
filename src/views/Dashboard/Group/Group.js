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
} from "@chakra-ui/react";
// Custom components
import useAxios from "axios-hooks";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect } from "react";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";
import GroupRegisterDialog from "components/Group/GroupRegisterDialog";
import GroupRow from "components/Group/GroupRow";

const groupApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_GROUPS;
function Group() {
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const [filter, setFilter] = useState(initialFilter)
    const {
        isOpen: isRegisterOpen,
        onOpen: onRegisterOpen,
        onClose: onRegisterClose,
    } = useDisclosure();
    const [{ data, loading, error }, refetch] = useAxios({
        url: groupApi,
        params: filter
    });

    return (
        <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
            <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
                <CardHeader p="6px 0px 22px 0px">
                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                        Group
                    </Text>
                    <Button
                        variant="primary"
                        maxH="30px"
                        m="10px"
                        onClick={onRegisterOpen}
                    >
                        Add
                    </Button>
                </CardHeader>
                <CardBody>
                    <GroupRegisterDialog
                        isOpen={isRegisterOpen}
                        onOpen={onRegisterOpen}
                        onClose={onRegisterClose}
                        fetchData={refetch}
                    // data={rowDomain}
                    />
                    <Table variant="simple" color={textColor}>
                        <Thead>
                            <Tr my=".8rem" pl="0px" color="gray.400">
                                <Th pl="0px" borderColor={borderColor} color="gray.400">
                                    Group Name
                                </Th>
                                <Th borderColor={borderColor} color="gray.400">
                                    Status
                                </Th>
                                <Th borderColor={borderColor}></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data?.groups?.map((row, index, arr) => {
                                return (
                                    <GroupRow
                                        id={row._id}
                                        isLast={index === arr.length - 1 ? true : false}
                                        fetchData={refetch}
                                        data={row}
                                    />
                                );
                            })}
                        </Tbody>
                    </Table>
                    <Flex justifyContent={"flex-end"}>
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

export default Group;
