import Counter from "../models/Counter.js";

const generatePilgrimId = async () => {
  const year = new Date().getFullYear();

  const counter = await Counter.findByIdAndUpdate(
    "pilgrimId",
    {
      $inc: {
        sequenceValue: 1,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  const serial = String(counter.sequenceValue).padStart(
    6,
    "0"
  );

  return `PIL-${year}-${serial}`;
};

export default generatePilgrimId;