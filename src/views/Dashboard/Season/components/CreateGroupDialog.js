import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  FormLabel,
  FormControl,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useToast,
  Flex,
  Text,
  Box,
  Avatar,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";
import InputController from "components/Form/InputController";
import { ValidateMessage, ROOT_API, API_ROUTES } from "utils/constant";
import SelectController from "components/Form/SelectController";
import { SeasonTypeOption } from "utils/constant";
import { pick } from "lodash";
import { ModalType } from "utils/constant";

const CreateGroupDialog = ({ isOpen, groupDetail, onClose, refetchData }) => {
  const cancelRef = useRef();
  const toast = useToast();
  const params = useParams();
  const { id } = params || {};
  const [{ loading: createLoading }, createGroupApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.CREATE_GROUP,
    },
    { manual: true }
  );
  const [{ loading: updateLoading }, updateGroupApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.UPDATE_GROUP,
    },
    { manual: true }
  );

  useEffect(
    () => () => {
      reset();
    },
    []
  );

  useEffect(() => {
    reset({
      ...pick(groupDetail, ["name", "seasonId"]),
    });
  }, [groupDetail]);

  const schema = yup.object().shape({
    name: yup.string().required(ValidateMessage.required),
  });
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const handleSuccess = () => {
    refetchData?.();
    toast({
      title: `${groupDetail?._id ? "Edit" : "Create"} Group Successfully`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onClose?.(ModalType.Add);
  };

  const handleError = (error) => {
    toast({
      title:
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data?.msg ||
        `${groupDetail?._id ? "Edit" : "Create"} Group Fail`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const onSubmit = (dataForm) => {
    if (groupDetail?._id) {
      updateGroupApi({
        data: {
          ...dataForm,
          type: dataForm?.type?.value,
          id: groupDetail?._id,
        },
      })
        .then(() => {
          handleSuccess();
        })
        .catch((error) => {
          handleError(error);
        });

      return;
    }

    createGroupApi({
      data: { ...dataForm, seasonId: id },
    })
      .then(() => {
        handleSuccess();
      })
      .catch((error) => {
        handleError(error);
      });
  };

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={() => {
        onClose?.(ModalType.Add);
      }}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>{`${
          groupDetail?._id ? "Edit" : "Create"
        } Group`}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <form>
            <InputController
              control={control}
              name="name"
              label="Name"
              isRequired
            />
          </form>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            ref={cancelRef}
            onClick={() => {
              onClose?.(ModalType.Add);
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            isLoading={createLoading || updateLoading}
            onClick={handleSubmit(onSubmit)}
          >
            OK
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateGroupDialog;
