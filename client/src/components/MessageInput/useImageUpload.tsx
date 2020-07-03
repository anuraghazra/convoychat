import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { toast } from "@convoy-ui";
import { useUploadImageMutation } from "graphql/generated/graphql";

interface IUseImageUpload {
  value: string;
  setValue: (value: React.SetStateAction<string>) => void;
}
const useImageUpload = ({ value, setValue }: IUseImageUpload) => {
  // Image uploading
  const [
    uploadImage,
    { loading: uploadImageInProgress },
  ] = useUploadImageMutation({
    onCompleted(data) {
      const replacedPlaceholder = value.replace(
        "![Uplading image...](...please wait)",
        `![Alt Text](${data.uploadImage.url})`
      );
      setValue && setValue(replacedPlaceholder);
    },
    onError(err) {
      toast.error("Something went wrong uploading image.");
    },
  });

  const handleOnDrop = useCallback(
    acceptedFiles => {
      uploadImage({
        variables: {
          file: acceptedFiles[0],
        },
      });
    },
    [uploadImage]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: handleOnDrop,
    onDropAccepted: () => {
      setValue && setValue(value + `\n\n![Uplading image...](...please wait)`);
    },
    accept: "image/jpeg, image/png",
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  return {
    open,
    isDragActive,
    getRootProps,
    getInputProps,
    uploadImageInProgress,
  };
};

export default useImageUpload;
