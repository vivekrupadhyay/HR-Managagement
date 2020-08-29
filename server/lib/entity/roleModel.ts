import * as mongoose from "mongoose";
import Role from "../interfaces/role.interface";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  isSuperAdmin: {
    type: Boolean,
  },
  isActive: {
    type: Boolean,
  },
});
const roleModel = mongoose.model<Role & mongoose.Document>("Role", roleSchema);

export default roleModel;
