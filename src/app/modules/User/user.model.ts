import bcrypt from 'bcrypt'
import { TUser, UserModel } from './user.interface'
import { Schema, model } from 'mongoose'
import config from '../../config'
import { USER_ROLE } from './user.constant'

const UserSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      // Validating email pattern
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [4, 'Password Must be 4 Charecter or more'],
      select: 0,
    },
    phone: {
      type: String,
    },
    profilePicture: {
      type: String,
      default:
        'https://res.cloudinary.com/dolttvkme/image/upload/v1727577381/profile_acc17l.webp',
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    role: {
      type: String,
      default: USER_ROLE.USER,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password
        return ret
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password
        return ret
      },
    },
  },
)

// * password hash with bcrypt
UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this

  user.role = USER_ROLE.USER

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )

  next()
})

UserSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password')
}

UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

// * Create User Model
export const User = model<TUser, UserModel>('User', UserSchema)
