import React, { useEffect, useRef } from "react";
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
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ValidateMessage } from "utils/constant";
import InputController from "components/Form/InputController";
import { API_ROUTES } from "utils/constant";
import { ROOT_API } from "utils/constant";
import useAxios from "axios-hooks";

const UpdateScoreDialog = ({ matchDetail, isOpen, onClose, fetchData }) => {
  console.log(
    "🚀 ~ file: UpdateScoreDialog.js:25 ~ UpdateScoreDialog ~ matchDetail:",
    matchDetail
  );
  const cancelRef = useRef();
  const toast = useToast();
  const [{ loading }, updateScoreApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.UPDATE_SCORE,
    },
    { manual: true }
  );

  useEffect(() => {
    reset({
      homeGoals: matchDetail?.homeGoals,
      awayGoals: matchDetail?.awayGoals,
    });
  }, [matchDetail]);

  const schema = yup.object().shape({
    homeGoals: yup
      .number()
      .typeError("Please enter a numeric value")
      .required(ValidateMessage.required)
      .min(0, "Please enter greater than or equal to 0")
      .max(20, "Please enter less than or equal to 20"),
    awayGoals: yup
      .number()
      .typeError("Please enter a numeric value")
      .required(ValidateMessage.required)
      .min(0, "Please enter greater than or equal to 0")
      .max(20, "Please enter less than or equal to 20"),
  });
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      homeGoals: 0,
      awayGoals: 0,
    },
  });

  const onSubmit = (dataForm) => {
    updateScoreApi({
      data: { ...dataForm, matchId: matchDetail?.matchId },
    })
      .then(() => {
        fetchData();
        toast({
          title: "Update Score Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose?.();
      })
      .catch((error) => {
        toast({
          title:
            error?.response?.data?.errors?.[0]?.msg ||
            error?.response?.data?.msg ||
            "Update Score Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <AlertDialog
      size="lg"
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Update Score</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <form className="match-form">
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem w="100%">
                <InputController
                  type="number"
                  control={control}
                  name="homeGoals"
                  label={matchDetail?.home_name || "Home Goals"}
                  isRequired
                />
              </GridItem>
              <GridItem w="100%">
                <InputController
                  type="number"
                  control={control}
                  name="awayGoals"
                  label={matchDetail?.away_name || "Away Goals"}
                  isRequired
                />
              </GridItem>
            </Grid>
          </form>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            loading={loading}
            onClick={handleSubmit(onSubmit)}
          >
            OK
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateScoreDialog;
