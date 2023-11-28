import {
  Flex,
  Text,
  Collapse,
  Box,
  useDisclosure,
  useToast,
  Spacer,
  Icon,
  Button,
} from "@chakra-ui/react";
import { BsXCircleFill } from "react-icons/bs";

import React, { useState, useEffect } from "react";

import { axiosPost } from "utils/api";
import AddKolIntoLinkDialog from "./AddKolIntoLinkDialog";
import EditLinkDialog from "./EditLinkDialog";
const deleteLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CDN_DELETE_LINK;

function ExpandedRow(props) {
  const { data, refetch, dataKols } = props;
  const toast = useToast();
  const {
    isOpen: isOpenAddKol,
    onOpen: onOpenAddKol,
    onClose: onCloseAddKol,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedLink, setSelectedLink] = useState();

  const handleAddKolIntoLink = (link) => {
    onOpenAddKol();
    setSelectedLink(link);
  };

  const handleDeleteLink = async (e, link) => {
    e.stopPropagation();
    if (window.confirm("Are you sure to remove this link")) {
      try {
        const dataDelete = {
          linkId: link._id,
        };
        const response = await axiosPost(
          deleteLinkApi + "/" + data?.fixture?.id,
          dataDelete
        );
        if (response?.data?.code == 0) {
          toast({
            title: "Delete Link Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          refetch();
        }
      } catch (error) {
        console.log(error);
        toast({
          title:
            error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg ||
            "Delete Link Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  const getLinkName = (linkUrl) => {
    const result = linkUrl?.split("/")?.pop();
    return result;
  };
  return (
    <>
      <Collapse in={true}>
        <Flex columnGap={2}>
          {data?.linkMatches?.length
            ? data.linkMatches.map((link, index) => (
                <Box
                  cursor={"pointer"}
                  display={"flex"}
                  flexDirection={"column"}
                  flex={1}
                  bg={"blue.400"}
                  px={2}
                  rowGap={1}
                  py={2}
                  justifyContent={"center"}
                  alignItems={"center"}
                  color={"white"}
                  borderRadius={6}
                  position={"relative"}
                  maxW={"200px"}
                >
                  <Text
                    onClick={() => {
                      setSelectedLink(link);
                      onOpen();
                    }}
                  >{`Link: ${getLinkName(link.link)}`}</Text>
                  <Text
                    onClick={() => {
                      setSelectedLink(link);
                      onOpen();
                    }}
                  >{`LinkBackup: ${getLinkName(link.linkBackup)}`}</Text>
                  <Text onClick={() => handleAddKolIntoLink(link)}>
                    {`${
                      link?.kol
                        ? "CMT: " +
                          (dataKols?.kols?.length
                            ? dataKols.kols.find(
                                (item) => item._id === link.kol
                              )?.name
                            : "")
                        : "Add Commentator"
                    }`}
                  </Text>
                  <Icon
                    as={BsXCircleFill}
                    position={"absolute"}
                    right={0}
                    top={0}
                    onClick={(e) => handleDeleteLink(e, link)}
                  />
                </Box>
              ))
            : ""}
        </Flex>
      </Collapse>
      <AddKolIntoLinkDialog
        isOpen={isOpenAddKol}
        onOpen={onOpenAddKol}
        onClose={onCloseAddKol}
        fetchData={refetch}
        dataCurrentMatch={data}
        dataKols={dataKols}
        link={selectedLink}
      />
      <EditLinkDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fetchData={refetch}
        data={selectedLink}
        matchId={data.matchId}
      />
    </>
  );
}

export default ExpandedRow;
