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
  
  const EditSubDomain = ({ isOpen, initialData, onUpdate, onClose }) => {
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
          <ModalHeader>Edit SubDomain</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>DOMAIN ID</FormLabel>
              <Input
                name="domain"
                value={editedData.domain}
                onChange={handleInputChange}
                />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>LINK</FormLabel>
              <Input
                name="link"
                value={editedData.link}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>ID</FormLabel>
              <Input
                name="_id"
                value={editedData.id}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>TYPE</FormLabel>
              <Input
                name="type"
                value={editedData.type}
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
  
  export default EditSubDomain;
  