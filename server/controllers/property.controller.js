import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllProperties = async (req, res) => {
  try {
    const {
      _end,
      _order,
      _start,
      _sort,
      title_like = "",
      propertyType = "",
    } = req.query;

    const query = {};

    if (propertyType !== "") {
      query.propertyType = propertyType;
    }

    if (title_like) {
      query.title = { $regex: title_like, $options: "i" };
    }

    const count = await Property.countDocuments(query);

    const limit = _end ? parseInt(_end) : 10;
    const skip = _start ? parseInt(_start) : 0;

    let sortObj = { _id: -1 };
    if (_sort) {
      sortObj = { [_sort]: _order === "asc" ? 1 : -1 };
    }

    const properties = await Property.find(query)
      .limit(limit)
      .skip(skip)
      .sort(sortObj);

    res.header("x-total-count", count.toString());
    res.header("Access-Control-Expose-Headers", "x-total-count");

    console.log("✓ Properties fetched:", properties.length, "Total:", count);
    res.status(200).json(properties);
  } catch (error) {
    console.error("❌ Error fetching properties:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getPropertyDetail = async (req, res) => {
  const { id } = req.params;
  const propertyExists = await Property.findOne({ _id: id }).populate(
    "creator"
  );

  if (propertyExists) {
    res.status(200).json(propertyExists);
    //also console log it
    console.log("✓ Property details fetched for ID:", id);
    
  } else {
    res.status(404).json({ message: "Property not found" });
  }
};

const createProperty = async (req, res) => {
  try {
    const { title, description, propertyType, location, price, photo, email } =
      req.body;

    console.log("🏠 Creating property for user:", email);

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    if (!user) {
      console.error("❌ User not found:", email);
      throw new Error("User not found");
    }

    // Handle photo - can be string (base64) or array
    let photoUrl;
    if (Array.isArray(photo) && photo.length > 0) {
      // Extract URL from first photo object if it's an array
      const photoData = photo[0];
      const photoToUpload =
        typeof photoData === "string" ? photoData : photoData.url;
      console.log("📸 Uploading photo to Cloudinary...");
      photoUrl = await cloudinary.uploader.upload(photoToUpload);
      console.log("✓ Photo uploaded:", photoUrl.url);
    } else if (typeof photo === "string") {
      console.log("📸 Uploading photo to Cloudinary...");
      photoUrl = await cloudinary.uploader.upload(photo);
      console.log("✓ Photo uploaded:", photoUrl.url);
    } else {
      throw new Error("No photo provided");
    }

    const newProperty = await Property.create({
      title,
      description,
      propertyType,
      location,
      price,
      photo: photoUrl.url,
      creator: user._id,
    });

    user.allProperties.push(newProperty._id);
    await user.save({ session });

    await session.commitTransaction();

    console.log("✓ Property created successfully:", newProperty._id);
    res.status(200).json({ message: "Property created successfully" });
  } catch (error) {
    console.error("❌ Error creating property:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, propertyType, location, price, photo } =
      req.body;

    const photoUrl = await cloudinary.uploader.upload(photo);

    await Property.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        propertyType,
        location,
        price,
        photo: photoUrl.url || photo,
      }
    );

    res.status(200).json({ message: "Property updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑️ Deleting property:", id);

    const propertyToDelete = await Property.findById(id).populate("creator");

    if (!propertyToDelete) {
      console.error("❌ Property not found:", id);
      return res.status(404).json({ message: "Property not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    await Property.deleteOne({ _id: id }, { session });

    // Remove property reference from user's allProperties array
    if (propertyToDelete.creator) {
      await User.findByIdAndUpdate(
        propertyToDelete.creator._id,
        { $pull: { allProperties: id } },
        { session }
      );
    }

    await session.commitTransaction();

    console.log("✓ Property deleted successfully:", id);
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting property:", error.message);
    res.status(500).json({ message: error.message });
  } finally {
    // Ensure session is ended
  }
};

export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
};
