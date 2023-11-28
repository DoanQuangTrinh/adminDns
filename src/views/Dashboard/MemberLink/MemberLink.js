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
import React, { useEffect } from "react";
import { tablesTableData } from "variables/general";
import useAxios from "axios-hooks";
import { getMemberToken } from "utils/authentication";
// import AddLinkDialog from "components/Links/AddLinkDialog";
import MemberLinksTableRow from "components/MemberLink/MemberLinksTableRow";
import AddLinkDialog from "components/Link/AddLinkDialog";

const memberLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_MEMBER_LINKS;

function MemberLink() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const mToken = getMemberToken();

  const [{ data, loading, error }, refetch] = useAxios({
    url: memberLinkApi,
    headers: {
      mToken,
    },
  });

  const {
    isOpen: isAddDeviceOpen,
    onOpen: onAddDeviceOpen,
    onClose: onAddDeviceClose,
  } = useDisclosure();

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Member Links Table
          </Text>
          <Button
            variant="primary"
            maxH="30px"
            m="10px"
            onClick={onAddDeviceOpen}
          >
            Add Link
          </Button>
        </CardHeader>
        <AddLinkDialog
          isOpen={isAddDeviceOpen}
          onOpen={onAddDeviceOpen}
          onClose={onAddDeviceClose}
          isAddLink={true}
          fetchData={() => refetch()}
          // data={props}
        />
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Name
                </Th>
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Url
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Status
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
              {data?.data?.length
                ? data?.data?.map((row, index, arr) => {
                    return (
                      <MemberLinksTableRow
                        row={row}
                        isLast={index === arr.length - 1 ? true : false}
                        key={index}
                        fetchData={() => refetch()}
                      />
                    );
                  })
                : ""}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default MemberLink;
