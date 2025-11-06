import mongoose from "mongoose";
import Response from "../models/Response.js";

const ObjectId = mongoose.Types.ObjectId;

/**
 * Compute aggregated stats for a single form field.
 * @param {Object} field - The field object from form.fields
 * @param {String} formId - The form ID
 * @returns {Promise<Object>} stats summary for this field
 */

export const computeFieldStats = async (field, formId) => {
  const matchStage = {
    $match: {
      form: new ObjectId(formId),
    },
  };

  const unwindAnswers = { $unwind: "$answers" };
  const matchField = {
    $match: { "answers.fieldId": new ObjectId(field._id) },
  };

  let pipeline = [matchStage, unwindAnswers, matchField];

  // Each field type uses a different aggregation logic
  switch (field.fieldType) {
    // TEXT / TEXTAREA
    case "text":
    case "textarea":
      pipeline.push(
        {
          $group: {
            _id: "$answers.value",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      );

      return {
        type: field.fieldType,
        name: field.name,
        topAnswers: await Response.aggregate(pipeline),
      };

    // NUMBER / RATING
    case "number":
    case "rating":
      pipeline.push({
        $group: {
          _id: null,
          average: { $avg: "$answers.value" },
          min: { $min: "$answers.value" },
          max: { $max: "$answers.value" },
        },
      });

      const numberStats = await Response.aggregate(pipeline);
      return {
        type: field.fieldType,
        name: field.name,
        stats: numberStats[0] || { average: 0, min: 0, max: 0 },
      };

    // RADIO / SELECT (single choice)
    case "radio":
    case "select":
      pipeline.push(
        {
          $group: {
            _id: "$answers.value",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } }
      );

      const radioCounts = await Response.aggregate(pipeline);
      return {
        type: field.fieldType,
        name: field.name,
        options: radioCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
      };

    // CHECKBOX (multi-select)
    case "checkbox":
      pipeline.push(
        { $unwind: "$answers.value" }, // because it's an array
        {
          $group: {
            _id: "$answers.value",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } }
      );

      const checkboxCounts = await Response.aggregate(pipeline);
      return {
        type: field.fieldType,
        name: field.name,
        options: checkboxCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
      };

    // DEFAULT
    default:
      return {
        type: field.fieldType,
        name: field.name,
        message: "No analytics available.",
      };
  }
};
