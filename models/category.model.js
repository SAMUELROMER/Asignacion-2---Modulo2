const { Schema, model } = require("mongoose");

const CategorysSchema = Schema({
  name: {
    type: String,
    required: [true, "name is mandatory"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

CategorysSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("Category", CategorysSchema);
