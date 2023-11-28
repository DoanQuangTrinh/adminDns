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
import { MatchResultOption } from "utils/constant";
import { Points } from "utils/constant";
import InputController from "components/Form/InputController";
import CheckboxController from "components/Form/CheckboxController";
import { MatchResultStatus } from "utils/constant";

const UpdateRankDialog = ({ isOpen, teamDetail, onClose, refetchData }) => {
  const cancelRef = useRef();
  const toast = useToast();
  const params = useParams();
  const { id } = params || {};
  const [{ loading: updateLoading }, updateRankApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.UPDATE_RANK,
    },
    { manual: true }
  );

  useEffect(
    () => () => {
      reset();
    },
    []
  );

  const schema = yup.object().shape({
    result: yup.object().nullable().required(ValidateMessage.required),
    goalsFor: yup
      .number()
      .nullable()
      .typeError(ValidateMessage.mustNumber)
      .min(0, ValidateMessage.minNumber)
      .required(ValidateMessage.required)
      .test({
        name: "goalsForWin",
        exclusive: false,
        message: "Goals for must must be greater than Goals against",
        test: function (value) {
          if (this.parent?.result?.value === MatchResultStatus.WIN) {
            return Number(this.parent.goalsAgain) < Number(value);
          }

          return true;
        },
      })
      .test({
        name: "goalsForDraw",
        exclusive: false,
        message: "Goals for must must be equal Goals against",
        test: function (value) {
          if (this.parent?.result?.value === MatchResultStatus.DRAW) {
            return Number(this.parent.goalsAgain) === Number(value);
          }
          console.log(this.parent.goalsAgain, value);
          return true;
        },
      })
      .test({
        name: "goalsForLose",
        exclusive: false,
        message: "Goals for must must be less than Goals against",
        test: function (value) {
          if (this.parent?.result?.value === MatchResultStatus.LOSE) {
            return Number(this.parent.goalsAgain) > Number(value);
          }

          return true;
        },
      }),
    goalsAgain: yup
      .number()
      .nullable()
      .typeError(ValidateMessage.mustNumber)
      .min(0, ValidateMessage.minNumber)
      .required(ValidateMessage.required),
  });
  const { control, handleSubmit, reset } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      result: undefined,
      goalsFor: 0,
      goalsAgain: 0,
    },
  });

  const handleSuccess = () => {
    refetchData?.();
    toast({
      title: `Update Successfully`,
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
        `Update Fail`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const onSubmit = (dataForm) => {
    updateRankApi({
      data: {
        ...dataForm,
        seasonId: id,
        teamId: teamDetail?.teamId?._id,
        result: dataForm?.result?.value,
        points: Points?.[dataForm?.result?.value] || 0,
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
        <AlertDialogHeader>Update rank</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <form>
            <SelectController
              styleBoxInput={{
                flexShrink: "1",
                flexGrow: "1",
                flexBasis: "0",
              }}
              control={control}
              options={MatchResultOption}
              name="result"
              label="Result"
              isRequired
            />
            <InputController
              type="number"
              control={control}
              name="goalsFor"
              label="Goals for"
              isRequired
              styleContainer={{ pt: "4" }}
            />
            <InputController
              type="number"
              control={control}
              name="goalsAgain"
              label="Goals against"
              isRequired
              styleContainer={{ pt: "4" }}
            />
            <CheckboxController
              styleContainer={{
                pt: "4",
                display: "flex",
                alignItems: "center",
              }}
              minWLabel="40px"
              control={control}
              name="isFinish"
              label="Finish"
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
            isLoading={updateLoading}
            onClick={handleSubmit(onSubmit)}
          >
            OK
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateRankDialog;
