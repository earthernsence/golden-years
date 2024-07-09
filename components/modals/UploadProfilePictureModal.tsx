"use client";

import { useClerk } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useEdgeStore } from "@/lib/edgestore";

import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/Dialog";
import { SingleImageDropzone } from "@/components/SingleImageDropzone";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/convex/_generated/api";

import { useUploadProfilePictureModal } from "@/hooks/use-upload-profile-picture-modal";

export const UploadProfilePictureModal = () => {
  const params = useParams();

  const { toast } = useToast();

  const update = useMutation(api.users.updateProfilePicture);

  const clerk = useClerk();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const image = useUploadProfilePictureModal();
  const { edgestore } = useEdgeStore();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    image.onClose();
  };

  const onChange = async(uploadedFile?: File) => {
    if (uploadedFile) {
      setIsSubmitting(true);
      setFile(uploadedFile);

      if (clerk.user) {
        await clerk.user.setProfileImage({ file: uploadedFile })
          .catch(e => {
            toast({
              title: "Could not upload a profile picture",
              description: `Refresh the page and try again. ${e}`
            });
          });
      }

      if (!clerk.user) {
        toast({
          title: "Could not upload a profile picture",
          description: `Refresh the page and try again.`
        });

        onClose();
        return;
      }

      await edgestore.publicFiles.upload({
        file: uploadedFile,
        options: { replaceTargetUrl: image.url }
      });

      await update({
        username: params.username as string,
        image: clerk.user.imageUrl
      });

      onClose();
    }
  };

  return (
    <Dialog open={image.isOpen} onOpenChange={image.onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="text-lg text-center font-semibold">
            Upload a new profile picture
          </div>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};