import Form from "../models/Form.js";
import Response from "../models/Response.js";

export const createForm = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { title, description, fields } = req.body;
    const form = await Form.create({
      owner: user_id,
      title,
      description,
      fields
    })
    res.status(201).json({ message: "Form created", formId: form._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating form" });
  }
};

export const getForms = async (req, res) => {
  try {
    const user_id = req.user_id;
    const forms = await Form.find({ owner: user_id }).populate("owner", "name email");
    res.status(200).json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching forms" });
  }
}

export const getFormById = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { formId } = req.params;
    const form = await Form.findById(formId).populate("owner", "name email");
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    console.log("Form Owner ID:", form.owner._id);
    console.log("Requesting User ID:", user_id); 
    if (!form.owner.equals(user_id) && !form.isPublished) {
      return res.status(403).json({ message: "Form is not published" });
    }
    res.status(200).json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching form" });
  }
};


export const deleteForm = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { formId } = req.params;
    const form = await Form.findById(formId).populate("owner", "name email");
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    if (!form.owner.equals(user_id)) {
      return res.status(403).json({ message: "Not authorized to delete this form" });
    }
    await form.deleteOne();
    res.status(200).json({ message: "Form deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting form" });
  }
};

export const submitResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const { data } = req.body;
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    Response.create({
      form: formId,
      answers: data,
    });
    res.status(200).json({ message: "Response submitted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting response" });
  }
};