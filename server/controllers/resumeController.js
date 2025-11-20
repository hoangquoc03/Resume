const imagekit = require("../config/imagekit");
import Resume from "../models/Resume.js";
import fs from "fs";

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    const newResume = await Resume.create({ userId, title });
    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    await Resume.findOneAndDelete({ userId, _id: resumeId });
    return res.status(201).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ userId, _id: resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updateAt = undefined;
    return res.status(201).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(201).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  // console.log("===== UPDATE RESUME REQUEST =====");
  // console.log("BODY RAW:", req.body);
  // console.log("FILE:", req.file);
  try {
    const userId = req.userId;
    const image = req.file;
    const resumeId = req.body.resumeId;

    if (!resumeId)
      return res.status(400).json({ message: "resumeId is required" });

    let resumeDataCopy = {};
    if (req.body.resumeData) {
      try {
        resumeDataCopy = JSON.parse(req.body.resumeData);
      } catch {
        return res.status(400).json({ message: "Invalid resumeData JSON" });
      }
    }

    // Upload image nếu có
    if (image) {
      const uploaded = await imagekit.upload({
        file: fs.createReadStream(image.path),
        fileName: image.originalname,
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (req.body.removeBackground ? ",e-bgremove" : ""),
        },
      });
      resumeDataCopy.personal_info = resumeDataCopy.personal_info || {};
      resumeDataCopy.personal_info.image = uploaded.url;
    }

    const resume = await Resume.findOne({ userId, _id: resumeId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    Object.assign(resume, resumeDataCopy);
    await resume.save();

    return res.status(200).json({ message: "Saved successfully", resume });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};
