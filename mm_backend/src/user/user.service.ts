import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    // Create or update user when they sign in
    async createOrUpdate(userData: Partial<User>): Promise<User | null> {
        const existingUser = await this.userModel.findOne({
            firebaseUid: userData.firebaseUid
        });

        if (existingUser) {
            // Update existing user
            return this.userModel.findByIdAndUpdate(
                existingUser._id,
                {
                    email: userData.email,
                    displayName: userData.displayName,
                    photoURL: userData.photoURL,
                },
                { new: true }
            ).exec();
        }

        // Create new user
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    // Find user by Firebase UID
    async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
        return this.userModel.findOne({ firebaseUid }).exec();
    }

    // Find user by email
    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    // Update user profile
    async updateProfile(firebaseUid: string, profile: Partial<User>): Promise<User | null> {
        return this.userModel.findOneAndUpdate(
            { firebaseUid },
            { $set: profile },
            { new: true }
        ).exec();
    }

    // Update photo URL (supports base64)
    async updatePhoto(firebaseUid: string, photoURL: string): Promise<User | null> {
        return this.userModel.findOneAndUpdate(
            { firebaseUid },
            { photoURL },
            { new: true }
        ).exec();
    }

    // Add to wishlist
    async addToWishlist(firebaseUid: string, productId: string): Promise<User | null> {
        return this.userModel.findOneAndUpdate(
            { firebaseUid },
            { $addToSet: { wishlist: productId } },
            { new: true }
        ).exec();
    }

    // Remove from wishlist
    async removeFromWishlist(firebaseUid: string, productId: string): Promise<User | null> {
        return this.userModel.findOneAndUpdate(
            { firebaseUid },
            { $pull: { wishlist: productId } },
            { new: true }
        ).exec();
    }

    // Update cart
    async updateCart(firebaseUid: string, cart: User['cart']): Promise<User | null> {
        return this.userModel.findOneAndUpdate(
            { firebaseUid },
            { cart },
            { new: true }
        ).exec();
    }

    // Add shipping address
    async updateShippingAddress(firebaseUid: string, shippingAddress: any): Promise<User | null> {
        return this.userModel.findOneAndUpdate(
            { firebaseUid },
            { $push: { shippingAddresses: shippingAddress } },
            { new: true }
        ).exec();
    }

    // Get all users (admin)
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    // Delete user
    async delete(firebaseUid: string): Promise<User | null> {
        return this.userModel.findOneAndDelete({ firebaseUid }).exec();
    }
}
