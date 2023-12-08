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
  import { API_ROUTES,ROOT_API } from "utils/constant";
  import useAxios from "axios-hooks";
  
  const getIpApi = ROOT_API + API_ROUTES.GET_IP_TRACKING
  
  function ListTracking(props) {
    const { status,id,subdomain,ip,nation, logo, journey, name, email, phone, role, date, isLast,benedict } = props;
    const textColor = useColorModeValue("gray.500", "white");
    const titleColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.400", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isRegisterOpen = isOpen;
    const onRegisterOpen = onOpen;
    const onRegisterClose = onClose;
    const history = useHistory();
    const toast = useToast();
    const [idForSubDomain, setIdForSubDomain] = useState(null);
    const [{ data, loading, error }, refetch] = useAxios({
      url:getIpApi,
    });
    const tracking = data?.data
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
    
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [selectedRow, setSelectedRow] = useState(null);
        const handleEditClick = (row) => {
          setSelectedRow(row);
          setIsEditModalOpen(true);
        };
    return (
      <Tr>
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
            width="56px"
            textAlign="center"
          >
            {nation}
          </Badge>
        </Td>
      </Tr>
    );
  }
  
  export default ListTracking;
  