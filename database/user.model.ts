import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
    name?: string;
    email: string;
    password?: string;
    image?: string;
    role: "alumno" | "profesor" | "admin" | "owner";
    provider: string;
    emailVerified: Date | null;
    isActive: boolean;
    birthDate?: Date;
    feesUpToDate?: boolean;
    socialMedia?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        password: {
            type: String,
            select: false, // no se devuelve por defecto
        },

        image: {
            type: String,
        },

        role: {
            type: String,
            enum: ["alumno", "profesor", "admin", "owner"],
            default: "alumno",
        },

        provider: {
            type: String,
            default: "credentials", // google, facebook, etc.
        },

        emailVerified: {
            type: Date,
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        birthDate: {
            type: Date,
        },

        feesUpToDate: {
            type: Boolean,
            default: false,
        },

        socialMedia: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // createdAt / updatedAt
    }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
