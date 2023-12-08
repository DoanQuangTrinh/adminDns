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
  
  // const deleteDomain = ROOT_API + API_ROUTES.DELETE_DOMAIN
  const deleteDomain = process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_DOMAIN
  
  function ListTracking(props) {
    const { status,id,subdomain,ip,nation, logo, journey, name, email, phone, role, date, isLast,benedict } = props;
    const textColor = useColorModeValue("gray.500", "white");
    const titleColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.400", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const history = useHistory();
    const toast = useToast();
    const [idForSubDomain, setIdForSubDomain] = useState(null);
    const [{ data, loading, error }, refetch] = useAxios({
      url:'https://api.linkshort.online/api/v1/tracking',
    });
    const tracking = data?.data
    console.log(tracking)
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
        const isRegisterOpen = isOpen;
        const onRegisterOpen = onOpen;
        const onRegisterClose = onClose;
    
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
                {id}
              </Text>
            </Flex>
          </Flex>
        </Td>
  
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {subdomain}
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
            {nation}
          </Badge>
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
  
  export default ListTracking;
  