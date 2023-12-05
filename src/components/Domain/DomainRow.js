import {
  Avatar,
  Badge,
  Button,
  Flex,
  IconButton,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React,{useState} from "react";
import { DeleteIcon, EditIcon, UnlockIcon } from "@chakra-ui/icons";
import axios from "axios";
import { axiosPost } from "utils/api";
import EditDomainDialog from "./EditDomainDialog";
import { useDataContext } from "context/UserContext";
const deleteDomain = process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_DOMAIN
console.log(deleteDomain)
function DomainRow(props) {
  const { zone_id,_id,userDetail, logo, ip, name, email, phone, role, status, date, isLast, refetch,ApiKey } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { domain, refetchDomainData } = useDataContext();
  const xToken = localStorage.getItem('xToken');
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa không?");

    if (!confirmDelete) {
      return;
    }
    const deleteId = {
      id : _id
    }
    try{
      const response = await axiosPost(
        deleteDomain,
        deleteId
      )
      refetchDomainData();
      if (response.data.code === 0) {
        toast({
          title: "Delete Domain Successfully",
          status: "success",
          duration: 9000,
        })
      } else {
        toast({
          title: "Delete Domain Error ",
          status: "error",
          duration: 9000,
        })
      }
    }
    catch (err){
      console.log(err)
    }
  }
      
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [selectedRow, setSelectedRow] = useState(null);
      const handleEditClick = (row) => {
        setSelectedRow(row);
        setIsEditModalOpen(true);
      };
      
  return (
    <Tr>
      <Td
        minWidth={{ sm: "250px" }}
        pl="0px"
        borderColor={borderColor}
        borderBottom={isLast ? "none" : null}
      >
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Flex direction="column">
            <Text
              fontSize="md"
              color={titleColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {ApiKey}
            </Text>
          </Flex>
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
            {ip}
          </Text>
        </Flex>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Badge
          bg={status === "Online" ? "green.400" : bgStatus}
          color="white"
          fontSize="16px"
          p="3px 10px"
          borderRadius="8px"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          width="100px"
        >
          {zone_id}
        </Badge>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {date}
        </Text>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <IconButton
          p={2}
          bg="transparent"
          onClick={props.onClick}
        >
          <EditIcon />
        </IconButton>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <IconButton
          p={2}
          bg="transparent"
          onClick={() => {
              handleDelete();
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
      </Td>
    </Tr>
  );
}

export default DomainRow;
