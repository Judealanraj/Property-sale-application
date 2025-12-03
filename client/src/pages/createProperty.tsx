import React from "react";
import { useGetIdentity } from "@refinedev/core";
import { FieldValues } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router";
import Form from "../components/common/Form";

const CreateProperty: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity();
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();
  const [propertyImage, setPropertyImage] = React.useState<
    { name: string; url: string }[]
  >([]);

  const handleImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setPropertyImage((prev) => [
          ...prev,
          { name: file.name, url: reader.result as string },
        ]);
      }
    };
    reader.readAsDataURL(file);
  };

  const onFinishHandler = (data: FieldValues) => {
    if (propertyImage.length < 1)
      return alert("Please upload at least one image");
    const formData = {
      ...data,
      photo: propertyImage,
      email: user?.email,
    };
    onFinish(formData);
  };

  return (
    <div>
      <Form
        type="Create"
        register={register}
        onFinish={onFinish}
        formLoading={formLoading}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        onFinishHandler={onFinishHandler}
        propertyImage={propertyImage[0] ?? { name: "", url: "" }}
      />
    </div>
  );
};

export default CreateProperty;
