const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (value) {
        // Custom validation logic
        const regex = /^\d{2,3}-\d+$/; // Two or three digits, hyphen, and one or more digits
        const strippedNumber = value.replace(/-/g, ""); // Remove hyphens for total digit count
        return regex.test(value) && strippedNumber.length >= 8;
      },
      message: (props) => `${props.value} is not a valid phone number format!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
