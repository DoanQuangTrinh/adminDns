import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useToast } from "@chakra-ui/react";
import useAxios from "axios-hooks";
import { Editor as TinyEditor } from "@tinymce/tinymce-react";
import "@tinymce/tinymce-react";
import { ROOT_API, TINY_API_KEY } from "utils/constant";

const Editor = ({ uploadApiUrl, onChange, ...props }, ref) => {
  const editorRef = useRef(null);
  const toast = useToast();

  const [, uploadImageApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + uploadApiUrl,
    },
    {
      manual: true,
    }
  );

  useImperativeHandle(
    ref,
    () => ({
      getContent: () => {
        if (editorRef.current) {
          return editorRef.current.getContent();
        }
      },
    }),
    [editorRef]
  );

  return (
    <>
      <TinyEditor
        apiKey={TINY_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          menubar: "file edit insert view format",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          language: "en",
          elementpath: false,
          branding: false,
          ...(!!uploadApiUrl && {
            file_picker_callback: (cb, value, meta) => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.addEventListener("change", (e) => {
                const file = e.target.files[0];
                const data = new FormData();

                data.append("imageFile", file);

                uploadImageApi({ data })
                  .then((res) => {
                    cb(
                      process.env.REACT_APP_API_HOST +
                        res?.data?.data?.imageUrl,
                      { title: file.name }
                    );
                  })
                  .catch((error) => {
                    toast({
                      title:
                        error?.response?.data?.errors?.[0]?.msg ||
                        error?.response?.data?.msg ||
                        "Upload image fail",
                      status: "error",
                      duration: 9000,
                      isClosable: true,
                    });
                  });
              });

              input.click();
            },
          }),
          setup: function (editor) {
            editor.on("PostRender", function () {
              const container = editor.getContainer();
              const uiContainer = document.querySelector(
                ".tox.tox-tinymce-aux"
              );

              container.parentNode.appendChild(uiContainer);
            });
          },
        }}
        onEditorChange={onChange}
        {...props}
      />
    </>
  );
};

export default forwardRef(Editor);
