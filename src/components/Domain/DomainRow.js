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
    useDisclosure
  } from "@chakra-ui/react";
  import React,{useState} from "react";
//   import { useState } from "react";
//   import UserDetailDialog from "./UserDetailDialog";
  import { DeleteIcon, EditIcon, UnlockIcon } from "@chakra-ui/icons";
import axios from "axios";
import EditDomainDialog from "./EditDomainDialog";
const deleteDomain = process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_DOMAIN
console.log(deleteDomain)
  function DomainRow(props) {
    const { zone_id,_id,userDetail, logo, ip, name, email, phone, role, status, date, isLast, handelUpdateUser, refetch,ApiKey } = props;
    const textColor = useColorModeValue("gray.500", "white");
    const titleColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.400", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const xToken = localStorage.getItem('xToken');
    console.log(_id)
      
    const [loading, setLoading] = useState(false);
      
        const handleDelete = async () => {
          try {
            setLoading(true);
      
            const response = await axios.post(
              deleteDomain,
              {
                id: _id,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'xToken': xToken,
                },
              }
            );
      
            if (response.data.code === 0) {
              onDeleted && onDeleted();
              console.log("Domain deleted successfully!");
            } else {
              console.error("Error deleting domain:", response.data.msg);
            }
          } catch (error) {
            console.error("Error deleting domain:", error);
          } finally {
            setLoading(false);
          }
        };
        
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
          {/* <UserDetailDialog
            isOpen={isDetailOpen}
            onOpen={onDetailOpen}
            onClose={onDetailClose}
            // tool={name}
            data={props}
          /> */}
          {/* <UserResetPasswordDialog
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            fetchData={refetch}
            id={id}
          /> */}
          <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
            {/* <Avatar src={logo} w="50px" borderRadius="12px" me="18px" /> */}
            <Flex direction="column">
              <Text
                fontSize="md"
                color={titleColor}
                fontWeight="bold"
                minWidth="100%"
              >
                {ApiKey}
              </Text>
              {/* <Text fontSize="sm" color="gray.400" fontWeight="normal">
                {ip}
              </Text> */}
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
            color={status === "Online" ? "white" : "white"}
            fontSize="16px"
            p="3px 10px"
            borderRadius="8px"
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
            <EditIcon />
          </IconButton>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <IconButton
            p={2}
            bg="transparent"
            onClick={() => {
              handleRowClickResetPassword();
            }}
          >
            <UnlockIcon />
          </IconButton>
        </Td>
      </Tr>
    );
  }
  
  export default DomainRow;
  