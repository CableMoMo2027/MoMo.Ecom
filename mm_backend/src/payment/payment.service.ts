import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import axios from 'axios';
import FormData from 'form-data';

// Using promptpay-qr library
const generatePayload = require('promptpay-qr');

@Injectable()
export class PaymentService {
    // Default PromptPay ID - can be phone number or national ID
    // TODO: Move to environment variable
    private readonly PROMPTPAY_ID = process.env.PROMPTPAY_ID || '0981058216';

    /**
     * Generate PromptPay QR Code as base64 image
     */
    async generatePromptPayQR(amount: number, phoneNumber?: string): Promise<{ qrCode: string; payload: string; promptpayId: string }> {
        const phone = phoneNumber || this.PROMPTPAY_ID;

        // Generate PromptPay payload using promptpay-qr library
        const payload = generatePayload(phone, { amount });

        try {
            const qrCode = await QRCode.toDataURL(payload, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
            });

            return {
                qrCode,
                payload,
                promptpayId: phone,
            };
        } catch (error) {
            throw new Error('Failed to generate QR code');
        }
    }

    /**
     * Verify slip using SlipOK API
     * Documentation: https://slipok.com/docs
     */
    async verifySlip(slipImage: Buffer, expectedAmount: number): Promise<any> {
        const SLIPOK_API_KEY = process.env.SLIPOK_API_KEY;
        const SLIPOK_BRANCH_ID = process.env.SLIPOK_BRANCH_ID || 'default';

        if (!SLIPOK_API_KEY) {
            // Return mock verification for development
            console.log('SlipOK API key not configured - using mock verification');
            return {
                verified: false,
                message: 'SlipOK API not configured. Please set SLIPOK_API_KEY in environment.',
                mockMode: true,
            };
        }

        try {
            const formData = new FormData();
            formData.append('files', slipImage, { filename: 'slip.jpg' });
            formData.append('amount', expectedAmount.toString());

            const response = await axios.post(
                `https://api.slipok.com/api/line/apikey/${SLIPOK_BRANCH_ID}`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        'x-authorization': SLIPOK_API_KEY,
                    },
                }
            );

            const data = response.data;

            return {
                verified: data.success === true,
                transactionId: data.data?.transRef,
                amount: data.data?.amount,
                senderName: data.data?.sender?.name,
                receiverName: data.data?.receiver?.name,
                transferDate: data.data?.transDate,
                errorMessage: data.message,
            };
        } catch (error: any) {
            console.error('SlipOK API error:', error);
            return {
                verified: false,
                errorMessage: error.message || 'Failed to verify slip',
            };
        }
    }
}
