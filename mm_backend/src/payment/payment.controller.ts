import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { OrderService } from '../order/order.service';

interface GenerateQRDto {
    amount: number;
    phoneNumber?: string;
}

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly orderService: OrderService,
    ) { }

    /**
     * Generate PromptPay QR Code
     * POST /payment/promptpay-qr
     */
    @Post('promptpay-qr')
    async generatePromptPayQR(@Body() dto: GenerateQRDto) {
        const { amount, phoneNumber } = dto;
        return this.paymentService.generatePromptPayQR(amount, phoneNumber);
    }

    /**
     * Upload and verify slip for an order
     * POST /payment/verify-slip/:orderId
     */
    @Post('verify-slip/:orderId')
    @UseInterceptors(FileInterceptor('slip'))
    async verifySlip(
        @Param('orderId') orderId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            return {
                success: false,
                message: 'No slip image uploaded',
            };
        }

        // Get order to check expected amount
        const order = await this.orderService.findByOrderId(orderId);
        if (!order) {
            return {
                success: false,
                message: 'Order not found',
            };
        }

        // Verify slip with SlipOK API
        const verification = await this.paymentService.verifySlip(
            file.buffer,
            order.total,
        );

        // Save verification result to order
        // For now, save as base64 - in production, upload to cloud storage
        const slipBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        await this.orderService.saveSlipVerification(
            orderId,
            slipBase64,
            verification,
        );

        return {
            success: verification.verified,
            orderId,
            verification,
        };
    }
}
