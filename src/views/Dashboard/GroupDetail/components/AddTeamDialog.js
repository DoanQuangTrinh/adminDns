import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";
import { ValidateMessage, ROOT_API, API_ROUTES } from "utils/constant";
import SelectController from "components/Form/SelectController";
import { ModalType } from "utils/constant";

const AddTeamDialog = ({ isOpen, groupDetail, onClose, refetchData }) => {
  const cancelRef = useRef();
  const toast = useToast();
  const params = useParams();
  const { id, groupId } = params || {};
  const [teamOptions, setTeamOptions] = useState([]);
  const [{ loading: createLoading }, addTeamIntoSeasonApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.ADD_TEAM_INTO_GROUP,
    },
    { manual: true }
  );
  const [{ data: teamsData }] = useAxios(
    {
      url: `${ROOT_API}${API_ROUTES.TEAM_OF_SEASON}/${id}?noGroup=1`,
    },
    {
      useCache: false,
    }
  );

  useEffect(
    () => () => {
      reset();
    },
    []
  );

  useEffect(() => {
    setTeamOptions(
      teamsData?.data?.map((item) => ({
        value: item?._id,
        label: item?.teamId?.name,
      }))
    );
  }, [teamsData?.data]);

  useEffect(() => {
    reset({
      teamId: groupDetail?.rankIds?.map((item) => ({
        value: item?._id,
        label: item?.teamId?.name,
      })),
    });
  }, [groupDetail]);

  const schema = yup.object().shape({
    teamId: yup.array().nullable().required(ValidateMessage.required),
  });
  const { control, handleSubmit, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      teamIds: undefined,
    },
  });
  const watchTeams = watch("teamId");

  const handleSuccess = () => {
    refetchData?.();
    toast({
      title: `Add Team Successfully`,
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
        `Add Team Fail`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const onSubmit = (dataForm) => {
    addTeamIntoSeasonApi({
      data: {
        groupId,
        rankIds: dataForm?.teamId?.map((item) => item.value).join(","),
      },
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
        <AlertDialogHeader>{`Add Team`}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <form>
            <div>
              <SelectController
                styleContainer={{ pt: "4" }}
                styleBoxInput={{
                  flexShrink: "1",
                  flexGrow: "1",
                  flexBasis: "0",
                }}
                control={control}
                options={teamOptions}
                name="teamId"
                label="Team"
                isRequired
                isMulti
                isOptionDisabled={() =>
                  watchTeams?.length === groupDetail?.maxNumberTeam
                }
              />
              <Box pt={2} fontSize="14px" color="gray.500">
                Selected team number: {watchTeams?.length || 0}
              </Box>
            </div>
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
            isLoading={createLoading}
            onClick={handleSubmit(onSubmit)}
          >
            OK
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddTeamDialog;
