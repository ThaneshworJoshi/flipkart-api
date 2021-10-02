import { hash, compare, genSalt } from 'bcryptjs';
import { model, Schema, Model, Document } from 'mongoose';
import { BCRYPT_WORK_FACTOR } from '../config/auth';

export interface UserDocument extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  password: string;
  contactNumber?: string;
  profilePicture?: string;
  role: Role;
  isBanned: boolean;
  isConfirmed: boolean;
  confirmOTP: boolean;
  otpTries: number;
  matchPassword: (password: string) => {};
}

enum Role {
  user = 0,
  publisher = 1,
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, 'Email already exsit'],
      required: [true, 'Please enter your email'],
    },
    firstName: {
      type: String,
      trim: true,
      min: [3, 'Too short rirstname'],
      max: [50, 'Firstname can not be logner than 50 character'],
    },
    lastName: {
      type: String,
      trim: true,
      min: [3, 'Too short lastname'],
      max: [50, 'Lastname can not be logner than 50 character'],
    },
    userName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Please enter your password'],
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    role: {
      type: Number,
      enum: [0, 1],
      default: 0,
      required: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    isConfirmed: { type: Boolean, required: true, default: 0 },
    confirmOTP: { type: String, required: false },
    otpTries: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

// /**
//  *
//  * @param {string} email - The user's email
//  * @param {ObjectId} [excludeUserId] - The id of user to be excluded
//  * @returns {Promise<boolean>}
//  */
// UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
//   const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
//   return !!user;
// };

/**
 * Use Bcrypt to check that an entered password matches the password of a user
 * @param {string} enteredPassword The password that a user enters
 * @returns {Promise<boolean>}
 */
UserSchema.methods.matchPassword = async function (this: any, enteredPassword: string) {
  console.log(this.password, enteredPassword);
  const result = await compare(enteredPassword, this.password);
  return result;
};

/**
 * Runs before the model saves and hecks to see if password has been
 * modified and hashes the password before saving to database
 */
UserSchema.pre<UserDocument>('save', async function (this: UserDocument, next: any) {
  let user = this as UserDocument;
  //only hash the password it has been modified (or is new)
  if (!user.isModified('password')) next();

  const salt = await genSalt(BCRYPT_WORK_FACTOR);
  const hashPassword = await hash(user.password, salt);
  user.password = hashPassword;
  next();
});

const User: Model<UserDocument> = model('User', UserSchema);
export default User;
