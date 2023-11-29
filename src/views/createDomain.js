import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";

const CreateDomainForm = ({ fetchData }) => {
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [zoneId, setZoneId] = useState("");
  const toast = useToast();

  const createDomain = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/domain/",
        {
          name,
          ip,
          api_key: apiKey,
          zone_id: zoneId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === 0) {
        toast({
          title: "Create Domain Success",
          status: "success",
        });
        fetchData(); // Fetch updated data after creating domain
      } else {
        toast({
          title: "Failed to create domain",
          status: "error",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "Error creating domain",
        status: "error",
      });
    }
  };

  return (
    <div>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter domain name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>IP</FormLabel>
        <Input
          type="text"
          placeholder="Enter IP address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>API Key</FormLabel>
        <Input
          type="text"
          placeholder="Enter API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Zone ID</FormLabel>
        <Input
          type="text"
          placeholder="Enter Zone ID"
          value={zoneId}
          onChange={(e) => setZoneId(e.target.value)}
        />
      </FormControl>
      <Button mt={4} colorScheme="teal" onClick={createDomain}>
        Create Domain
      </Button>
    </div>
  );
};

export default CreateDomainForm;
