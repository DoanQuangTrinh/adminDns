import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import KolRegisterDialog from "./KolRegisterDialog";
import { axiosPost } from "utils/api";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { STATUS } from "utils/constant";
const deleteKolApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_KOL;

function KolRow(props) {
  const { id, name, avatar, isLast, fetchData, status, phone, email } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const approvedColor = useColorModeValue("green.600", "green.900");
  const pendingColor = useColorModeValue("red.500", "red.900");
  const toast = useToast();
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  function handleRowClick() {
    onRegisterOpen();
  }

  async function handleDeleteClick() {
    if (window.confirm("Are you sure to delete the kol?")) {
      const kolData = {
        id,
      };
      try {
        const response = await axiosPost(deleteKolApi, kolData);
        if (response?.data?.code == 0) {
          toast({
            title: "Delete Kol Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          fetchData();
        }
      } catch (error) {
        toast({
          title:
            error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg ||
            "Delete Kol Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }

  const getColor = (status) => {
    switch (status) {
      case STATUS.PENDING:
        return pendingColor;
      case STATUS.APPROVED:
        return approvedColor;
      default:
        return titleColor;
    }
  }


  return (
    <>
      <Tr>
        <Td
          width="100px"
          pl="0px"
          borderColor={borderColor}
          borderBottom={isLast ? "none" : null}
        >
          <Flex align="center" py=".8rem" width="100%" flexWrap="nowrap">
            <Avatar src={avatar} w="50px" borderRadius="12px" me="18px" />
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {name}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {email}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {phone}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text
              fontSize="md"
              color={getColor(status)}
              fontWeight="bold"
              textTransform={"capitalize"}
            >
              {status}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Button
            px="2"
            bg="transparent"
            // variant="no-effects"
            onClick={handleRowClick}
            mr={4}
          >
            <EditIcon />
          </Button>
          <Button
            px="2"
            bg="transparent"
            // variant="no-effects"
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
          </Button>
        </Td>
      </Tr>
      <KolRegisterDialog
        isOpen={isRegisterOpen}
        onOpen={onRegisterOpen}
        onClose={onRegisterClose}
        fetchData={fetchData}
        data={{
          avatar,
          name,
          id,
          phone,
          email, status
        }}
      />
    </>
  );
}

export default KolRow;
