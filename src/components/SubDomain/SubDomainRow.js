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
  import { useEffect } from "react";
//   import { useState } from "react";
//   import UserDetailDialog from "./UserDetailDialog";
  import { DeleteIcon, EditIcon, UnlockIcon } from "@chakra-ui/icons";
import axios from "axios";
// import EditDomainDialog from "./EditDomainDialog";
const DeleteSubDomain = process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_SUBDOMAIN
console.log(DeleteSubDomain)
function SubDomainRow(props) {
    const {_id, ip, name, isLast,domain, link ,id , type,date, handelUpdateUser } = props;
    const textColor = useColorModeValue("gray.500", "white");
    const titleColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.400", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const xToken = localStorage.getItem('xToken');
    console.log(domain)
      
    const [loading, setLoading] = useState(false);
    
        const handleDelete = async () => {
          try {
            setLoading(true);
      
            const response = await axios.post(
              DeleteSubDomain,
              {
                id: id,
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
              setData((prevData) => prevData.filter((item) => item.id !== id));
            } else {
              console.error("Error deleting domain:", response.data.msg);
            }
          } catch (error) {
            console.error("Error deleting domain:", error);
          } finally {
            setLoading(false);
          }
        };
        // useEffect(() => {
        //     handleDelete();
        // }, []);
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
                {domain}
              </Text>
            </Flex>
          </Flex>
        </Td>
  
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {link}
            </Text>
          </Flex>
        </Td>
  
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {id}
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
            {type}
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
          {/* <IconButton
            p={2}
            bg="transparent"
            onClick={() => {
              handleRowClickResetPassword();
            }}
          >
            <UnlockIcon /> */}
          {/* </IconButton> */}
        </Td>
      </Tr>
    );
  }
  
  export default SubDomainRow;
  