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
import { DeleteIcon, EditIcon, UnlockIcon ,ExternalLinkIcon} from "@chakra-ui/icons";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { axiosPost } from "utils/api";
import EditDomainDialog from "./EditDomainDialog";
import { useDataContext } from "context/UserContext";
<<<<<<< HEAD
const deleteDomain = process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_DOMAIN
console.log(deleteDomain)
  function DomainRow(props) {
    const { zone_id,_id,userDetail, logo, ip, name, email, phone, role, status, date, isLast, refetch,ApiKey } = props;
    const textColor = useColorModeValue("gray.500", "white");
    const titleColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.400", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data, refetchData } = useDataContext();
      
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
      const deleteId = {
        id : _id
      }
      try{
        const response = await axiosPost(
          deleteDomain,
          deleteId
        )
        console.log("Data before refetch:", data);
        refetchData();
        console.log("Data after refetch:", data);
      }
      catch (err){
        console.log(err)
=======
import { API_ROUTES,ROOT_API } from "utils/constant";
import AddSubDomain from "components/SubDomain/AddSubDomain";
import { Link } from "react-router-dom"; 

const deleteDomain = ROOT_API + API_ROUTES.DELETE_DOMAIN

function DomainRow(props) {
  const { status,_id,userDetail, logo, journey, name, email, phone, role, date, isLast, refetch,benedict } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const xToken = localStorage.getItem('xToken');
  const history = useHistory();
  const toast = useToast();
  const isRegisterOpen = isOpen;
  const onRegisterOpen = onOpen;
  const onRegisterClose = onClose;
  const handleSubDomainClick = () => {
    history.push(`/admin/domain/${_id}/subDomain`);
  };
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
      if (response.data.code === 0) {
        toast({
          title: "Delete Domain Successfully",
          status: "success",
          duration: 9000,
        })
        refetch();
      } else {
        toast({
          title: "Delete Domain Error ",
          status: "error",
          duration: 9000,
        })
>>>>>>> newbranch
      }
    }
    catch (error){
      console.log(error)
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg || "Delete Group Fail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }
  return (
    <Tr>
      {isRegisterOpen && <AddSubDomain
        ids={_id}
        isOpen={isRegisterOpen}
        userDetail={userDetail}
        onOpen={onRegisterOpen}
        onClose={handelCloseModal}
      />
    }
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
              {benedict}
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
            {journey}
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
          {status}
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
          onClick={() => {
              handleDelete();
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <IconButton p={2} bg="transparent" onClick={handleSubDomainClick}>
            <ExternalLinkIcon />
          </IconButton>
      </Td>

    </Tr>
  );
}

export default DomainRow;
