import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // Sync user from Firebase (call after login)
    @Post('sync')
    async syncUser(@Body() userData: {
        firebaseUid: string;
        email: string;
        displayName?: string;
        photoURL?: string;
    }): Promise<User | null> {
        return this.userService.createOrUpdate(userData);
    }

    // Get user by Firebase UID
    @Get(':firebaseUid')
    async getUser(@Param('firebaseUid') firebaseUid: string): Promise<User | null> {
        return this.userService.findByFirebaseUid(firebaseUid);
    }

    // Update user profile
    @Put(':firebaseUid/profile')
    async updateProfile(
        @Param('firebaseUid') firebaseUid: string,
        @Body() profile: Partial<User>,
    ): Promise<User | null> {
        return this.userService.updateProfile(firebaseUid, profile);
    }

    // Update photo URL (supports base64)
    @Put(':firebaseUid/photo')
    async updatePhoto(
        @Param('firebaseUid') firebaseUid: string,
        @Body() body: { photoURL: string },
    ): Promise<User | null> {
        return this.userService.updatePhoto(firebaseUid, body.photoURL);
    }

    // Add to wishlist
    @Post(':firebaseUid/wishlist/:productId')
    async addToWishlist(
        @Param('firebaseUid') firebaseUid: string,
        @Param('productId') productId: string,
    ): Promise<User | null> {
        return this.userService.addToWishlist(firebaseUid, productId);
    }

    // Remove from wishlist
    @Delete(':firebaseUid/wishlist/:productId')
    async removeFromWishlist(
        @Param('firebaseUid') firebaseUid: string,
        @Param('productId') productId: string,
    ): Promise<User | null> {
        return this.userService.removeFromWishlist(firebaseUid, productId);
    }

    // Update cart
    @Put(':firebaseUid/cart')
    async updateCart(
        @Param('firebaseUid') firebaseUid: string,
        @Body() cart: User['cart'],
    ): Promise<User | null> {
        return this.userService.updateCart(firebaseUid, cart);
    }

    // Update shipping address
    @Put(':firebaseUid/shipping-address')
    async updateShippingAddress(
        @Param('firebaseUid') firebaseUid: string,
        @Body() shippingAddress: User['shippingAddresses'],
    ): Promise<User | null> {
        return this.userService.updateShippingAddress(firebaseUid, shippingAddress);
    }

    // Get all users (admin only - add auth guard later)
    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.userService.findAll();
    }
}
