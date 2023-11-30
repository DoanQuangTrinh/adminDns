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
  } from "@chakra-ui/react";
  import React, { useState, useEffect } from "react";
  
  const EditDomainDialog = ({ isOpen, initialData, onUpdate, onClose }) => {
    const [editedData, setEditedData] = useState(initialData);
  
    useEffect(() => {
      setEditedData(initialData);
    }, [initialData]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleUpdate = () => {
      onUpdate(editedData);
      onClose();
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Domain</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Api Key</FormLabel>
              <Input
                name="ApiKey"
                value={editedData.ApiKey}
                onChange={handleInputChange}
                />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={editedData.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>IP</FormLabel>
              <Input
                name="ip"
                value={editedData.ip}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Zone ID</FormLabel>
              <Input
                name="zone_id"
                value={editedData.zone_id}
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
  