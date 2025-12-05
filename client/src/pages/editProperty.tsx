import React, { useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import { FieldValues } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigate, useParams } from "react-router";
import Form from "../components/common/Form";
import axios from "axios";

const EditProperty: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: user } = useGetIdentity();
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,
  } = useForm({
    refineCoreProps: {
      resource: "properties",
      action: "edit",
      id: id,
    },
  });

  const [propertyImage, setPropertyImage] = React.useState<{
    name: string;
    url: string;
  }>({ name: "", url: "" });
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch existing property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const serverUrl =
          import.meta.env.VITE_SERVER_URL || "https://property-sale-application-8ky7porsg-judes-projects-19ab628c.vercel.app/";
        const response = await axios.get(
          `${serverUrl}/api/v1/properties/${id}`
        );
        const property = response.data;

        // Set form values
        setValue("title", property.title);
        setValue("description", property.description);
        setValue("propertyType", property.propertyType);
        setValue("location", property.location);
        setValue("price", property.price);

        // Set existing image
        setPropertyImage({
          name: "existing-photo",
          url: property.photo,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching property:", error);
        alert("Failed to load property data");
        navigate("/properties");
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, setValue, navigate]);

  const handleImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setPropertyImage({
          name: file.name,
          url: reader.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const onFinishHandler = async (data: FieldValues) => {
    if (!propertyImage.url) {
      return alert("Please upload an image");
    }

    const formData = {
      ...data,
      photo: propertyImage.url,
      email: user?.email,
    };

    try {
      await onFinish(formData);
      navigate(`/properties/show/${id}`);
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Form
        type="Edit"
        register={register}
        onFinish={onFinish}
        formLoading={formLoading}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        onFinishHandler={onFinishHandler}
        propertyImage={propertyImage}
      />
    </div>
  );
};

export default EditProperty;
