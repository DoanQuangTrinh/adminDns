// Import các thư viện và thành phần cần thiết
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { axiosPost } from "utils/api";
import { useDataContext } from "context/UserContext";
const editDomain =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_EDIT_DOMAIN;
const EditDomainDialog = ({ refetch, isOpen, initialData, onUpdate, onClose, id,ApiKey,name,ip,zone_id }) => {
  const [editedData, setEditedData] = useState(initialData);
  const { domain, refetchDomainData } = useDataContext();
  const toast = useToast();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
      const dataEdit = {
        id: editedData?._id,
        api_key: editedData?.api_key,
        name: editedData?.name,
        ip: editedData?.ip,
        zone_id: editedData?.zone_id,
      }
    try {
      const response = await axiosPost(
        editDomain,
        dataEdit
        );
        if (response.status === 200) {
          toast({
            title: "Update Domain Successfully",
            status: "success",
            duration: 9000,
          })
          refetch();
          onClose();
      } else {
        toast({
          title: "Update Domain Error ",
          status: "error",
          duration: 9000,
        })
      }
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra khi gọi API:'
      })
      console.error('Có lỗi xảy ra khi gọi API:', error.message);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Domain</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mt={4}>
            <FormLabel>Api Key</FormLabel>
            <Input
              name="ApiKey"
              value={editedData?.api_key}
              onChange={handleInputChange}
              />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={editedData?.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>IP</FormLabel>
            <Input
              name="ip"
              value={editedData?.ip}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Zone ID</FormLabel>
            <Input
              name="zone_id"
              value={editedData?.zone_id}
              onChange={handleInputChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
            Update
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditDomainDialog;
