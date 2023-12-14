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
    Checkbox,
  } from "@chakra-ui/react";
import React,{useState,useEffect} from "react";
import { axiosPost } from "utils/api";
import { DeleteIcon, EditIcon, UnlockIcon,InfoIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { API_ROUTES , ROOT_API } from "utils/constant";
import SubDomain from "views/Dashboard/SubDomain/SubDomain";
const DeleteSubDomain = ROOT_API + API_ROUTES.DELETE_SUBDOMAIN
function SubDomainRow(props) {
    const {data,refetch,_id, ip, name, isLast,domain, link ,id , linkRedirect,date, handelUpdateUser,onDeleted,onIdChange } = props;
    const textColor = useColorModeValue("gray.500", "white");
    const titleColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.400", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const history = useHistory();
    const [idSubDomain , setIdSubDomain] = useState("")
    const handleSubDomainClick = () => {
      history.push(`/admin/subDomain/${id}/tracking`);
      setIdSubDomain(id);
      onRegisterOpen();
    };
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
      const confirmDelete = window.confirm("Bạn có chắc muốn xóa không?");
      if (!confirmDelete) {
        return;
      }
      const ids = id
      try {
        const response = await axiosPost(
          DeleteSubDomain,
          {ids : [id]}
        )
        if (response.data.code === 0) {
          toast({
            title: response.data.msg,
            duration: 9000,
          })
          refetch();
        }
      }
      catch (error) {
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
        const isRegisterOpen = isOpen;
        const onRegisterOpen = onOpen;
        const onRegisterClose = onClose;
        const [isChecked, setIsChecked] = useState(true);

        const handleCheckboxChange = () => {
          setIsChecked(!isChecked);
          onIdChange(id, !isChecked);
        };
        useEffect(() =>{
          setIsChecked(false);
        },[id])
    return (
      <Tr>
         <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
         <Checkbox onChange={handleCheckboxChange} isChecked={isChecked} />
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
              {linkRedirect}
            </Text>
          </Flex>
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
            <InfoIcon />
          </IconButton>
      </Td>
      </Tr>
      
    );
  }
  
  export default SubDomainRow;
  