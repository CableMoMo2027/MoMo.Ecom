import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    firebaseUid: string; // Firebase Auth UID

    @Prop({ required: true })
    email: string;

    @Prop()
    displayName?: string;

    @Prop()
    photoURL?: string;

    @Prop({ default: 'user' })
    role: string; // 'user', 'admin'

    @Prop({ type: Object })
    profile?: {
        phone?: string;
        address?: string;
        dateOfBirth?: Date;
    };

    @Prop({ type: [String], default: [] })
    wishlist: string[]; // Array of product IDs

    @Prop({ type: Object })
    cart?: {
        items: Array<{
            productId: string;
            quantity: number;
        }>;
    };

    @Prop({ type: Array, default: [] })
    shippingAddresses?: Array<{
        name?: string;
        phone?: string;
        address?: string;
        city?: string;
        postalCode?: string;
    }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
