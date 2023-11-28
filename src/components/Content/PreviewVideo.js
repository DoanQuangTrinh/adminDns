import React from "react";

import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";

const mediaUrl = process.env.REACT_APP_API_HOST;

const PreviewVideo = ({ isOpen, onOpen, onClose, videoUrl }) => {
  const cancelRef = React.useRef();

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        size="xl"
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Video</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody pb={8}>
            <ReactPlayer
              // className="react-player"
              url={mediaUrl + '/' + videoUrl}
              width="100%"
              height="100%"
              controls={true}
            />
          </AlertDialogBody>
          {/* <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Close
            </Button>
          </AlertDialogFooter> */}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PreviewVideo;
