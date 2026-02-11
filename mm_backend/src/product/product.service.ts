import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService implements OnModuleInit {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) { }

    // Seed data when module initializes (if database is empty)
    async onModuleInit() {
        const count = await this.productModel.countDocuments();
        if (count === 0) {
            await this.seedProducts();
        }
    }

    // Seed initial products
    private async seedProducts() {
        const products = [
            // ==================== TRENDING (10 items) ====================
            {
                name: 'Logitech G Pro X Superlight',
                description: 'Wireless Gaming Mouse - Ultra Lightweight',
                price: 3990,
                oldPrice: 4990,
                image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
                badge: 'Trending',
                category: 'trending',
            },
            {
                name: 'Razer BlackWidow V3 Pro',
                description: 'Wireless Mechanical Gaming Keyboard',
                price: 6490,
                oldPrice: 7990,
                image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop',
                badge: 'Hot',
                category: 'trending',
            },
            {
                name: 'SteelSeries Arctis 7+',
                description: 'Wireless Gaming Headset - Lossless Audio',
                price: 5490,
                image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop',
                badge: 'New',
                category: 'trending',
            },
            {
                name: 'ASUS ROG Swift 360Hz',
                description: 'Esports Gaming Monitor - 24.5 inch',
                price: 18990,
                oldPrice: 22990,
                image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
                badge: 'Pro',
                category: 'trending',
            },
            {
                name: 'Elgato Stream Deck MK.2',
                description: 'Studio Controller - 15 LCD Keys',
                price: 5290,
                image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop',
                category: 'trending',
            },
            {
                name: 'Secretlab Titan Evo 2022',
                description: 'Ergonomic Gaming Chair - Premium',
                price: 15990,
                oldPrice: 18990,
                image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop',
                badge: 'Best Seller',
                category: 'trending',
            },
            {
                name: 'NVIDIA GeForce RTX 4070',
                description: '12GB GDDR6X Graphics Card',
                price: 22990,
                image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop',
                badge: 'Gaming',
                category: 'trending',
            },
            {
                name: 'Samsung 990 Pro 2TB',
                description: 'NVMe M.2 SSD - 7450MB/s',
                price: 6990,
                oldPrice: 8990,
                image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop',
                category: 'trending',
            },
            {
                name: 'Corsair Dominator 32GB',
                description: 'DDR5 6000MHz RGB Memory',
                price: 7490,
                image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop',
                badge: 'Performance',
                category: 'trending',
            },
            {
                name: 'Razer Kiyo Pro Ultra',
                description: '4K Streaming Webcam - AI Focus',
                price: 8990,
                oldPrice: 10990,
                image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop',
                badge: 'Streamer',
                category: 'trending',
            },

            // ==================== KEYBOARDS (10 items) ====================
            {
                name: 'Ducky One 3 SF',
                description: '65% Mechanical Keyboard - Hot Swap',
                price: 4290,
                image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop',
                category: 'keyboards',
            },
            {
                name: 'HyperX Alloy Origins 65',
                description: 'Compact Mechanical Keyboard - RGB',
                price: 3290,
                oldPrice: 3990,
                image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400&h=400&fit=crop',
                badge: 'Sale',
                category: 'keyboards',
            },
            {
                name: 'Razer Huntsman V2 TKL',
                description: 'Optical Gaming Keyboard - Linear',
                price: 5490,
                image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop',
                badge: 'Fast',
                category: 'keyboards',
            },
            {
                name: 'Logitech G915 TKL',
                description: 'Wireless Low Profile Keyboard',
                price: 6990,
                oldPrice: 7990,
                image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
                badge: 'Premium',
                category: 'keyboards',
            },
            {
                name: 'Keychron Q1 Pro',
                description: '75% Wireless QMK Keyboard',
                price: 5990,
                image: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&h=400&fit=crop',
                badge: 'Custom',
                category: 'keyboards',
            },
            {
                name: 'SteelSeries Apex Pro TKL',
                description: 'Adjustable Actuation - OmniPoint',
                price: 6290,
                image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop',
                category: 'keyboards',
            },
            {
                name: 'Corsair K70 RGB Pro',
                description: 'Cherry MX Speed - Tournament',
                price: 4990,
                oldPrice: 5490,
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
                badge: 'Esports',
                category: 'keyboards',
            },
            {
                name: 'ASUS ROG Falchion Ace',
                description: '65% Dual USB-C Keyboard',
                price: 4490,
                image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e4?w=400&h=400&fit=crop',
                category: 'keyboards',
            },
            {
                name: 'Wooting 60HE',
                description: 'Analog Rapid Trigger Keyboard',
                price: 6790,
                image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=400&h=400&fit=crop',
                badge: 'Pro Gaming',
                category: 'keyboards',
            },
            {
                name: 'Glorious GMMK Pro',
                description: '75% Gasket Mount - Barebone',
                price: 4990,
                oldPrice: 5990,
                image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=400&fit=crop',
                badge: 'Modular',
                category: 'keyboards',
            },

            // ==================== MICE (10 items) ====================
            {
                name: 'Razer Viper V2 Pro',
                description: 'Wireless Esports Mouse - 58g',
                price: 4990,
                image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop',
                badge: 'Best Seller',
                category: 'mice',
            },
            {
                name: 'Logitech G502 X Plus',
                description: 'Wireless RGB Gaming Mouse',
                price: 4790,
                image: 'https://images.unsplash.com/photo-1625768628227-fa2d8e42be91?w=400&h=400&fit=crop',
                category: 'mice',
            },
            {
                name: 'Finalmouse UltralightX',
                description: 'Magnesium Esports Mouse - 29g',
                price: 5990,
                oldPrice: 6990,
                image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=400&h=400&fit=crop',
                badge: 'Ultra Light',
                category: 'mice',
            },
            {
                name: 'Pulsar X2 Mini Wireless',
                description: 'Symmetrical Esports Mouse',
                price: 3290,
                image: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=400&h=400&fit=crop',
                badge: 'Compact',
                category: 'mice',
            },
            {
                name: 'Zowie EC2-CW Wireless',
                description: 'Professional Esports Mouse',
                price: 4490,
                image: 'https://images.unsplash.com/photo-1613141411244-0e4ac259d217?w=400&h=400&fit=crop',
                badge: 'Pro',
                category: 'mice',
            },
            {
                name: 'SteelSeries Aerox 5 Wireless',
                description: '9 Programmable Buttons - 74g',
                price: 3990,
                oldPrice: 4690,
                image: 'https://images.unsplash.com/photo-1629429407756-446d66f5b24f?w=400&h=400&fit=crop',
                category: 'mice',
            },
            {
                name: 'Glorious Model O 2 Wireless',
                description: 'Honeycomb Shell - BAMF 2.0',
                price: 2990,
                image: 'https://images.unsplash.com/photo-1560152302-19b5a792dec2?w=400&h=400&fit=crop',
                badge: 'Value',
                category: 'mice',
            },
            {
                name: 'Razer DeathAdder V3 Pro',
                description: 'Ergonomic Wireless - 63g',
                price: 5290,
                image: 'https://images.unsplash.com/photo-1628832307345-7404b47f1751?w=400&h=400&fit=crop',
                badge: 'Ergonomic',
                category: 'mice',
            },
            {
                name: 'Lamzu Atlantis Mini',
                description: 'Wireless PAW3395 - 49g',
                price: 2790,
                oldPrice: 3290,
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
                badge: 'Mini',
                category: 'mice',
            },
            {
                name: 'Corsair Dark Core RGB Pro',
                description: 'Wireless FPS/MOBA Gaming',
                price: 3490,
                image: 'https://images.unsplash.com/photo-1616788494672-ec7ca25fdda9?w=400&h=400&fit=crop',
                category: 'mice',
            },

            // ==================== HEADSETS (10 items) ====================
            {
                name: 'HyperX Cloud III Wireless',
                description: 'Gaming Headset - 120Hr Battery',
                price: 4990,
                image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
                badge: 'Best Seller',
                category: 'headsets',
            },
            {
                name: 'Razer Kraken V3 Pro',
                description: 'Haptic Gaming Headset - THX',
                price: 5990,
                image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop',
                badge: 'Haptic',
                category: 'headsets',
            },
            {
                name: 'SteelSeries Arctis Nova Pro',
                description: 'Wireless Hi-Fi Gaming Headset',
                price: 11990,
                oldPrice: 13990,
                image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
                badge: 'Premium',
                category: 'headsets',
            },
            {
                name: 'Logitech G Pro X 2',
                description: 'Lightspeed Wireless - Pro Grade',
                price: 7990,
                image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
                badge: 'Pro',
                category: 'headsets',
            },
            {
                name: 'Corsair Virtuoso RGB XT',
                description: 'Hi-Fi Wireless - Broadcast Mic',
                price: 7490,
                oldPrice: 8990,
                image: 'https://images.unsplash.com/photo-1583305439380-0f3f1d71cf4a?w=400&h=400&fit=crop',
                category: 'headsets',
            },
            {
                name: 'Astro A50 Gen 5',
                description: 'Wireless Dolby Atmos Headset',
                price: 10990,
                image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
                badge: 'Atmos',
                category: 'headsets',
            },
            {
                name: 'Audio-Technica ATH-GL3',
                description: 'Closed-Back Gaming Headset',
                price: 4290,
                image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
                category: 'headsets',
            },
            {
                name: 'EPOS H6PRO Closed',
                description: 'Premium Acoustic Gaming',
                price: 5490,
                oldPrice: 6490,
                image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
                badge: 'Studio',
                category: 'headsets',
            },
            {
                name: 'Beyerdynamic MMX 150',
                description: 'USB Gaming Headset - META Voice',
                price: 3990,
                image: 'https://images.unsplash.com/photo-1548921847-1f7ed2d1e1b7?w=400&h=400&fit=crop',
                category: 'headsets',
            },
            {
                name: 'JBL Quantum 910 Wireless',
                description: 'ANC Gaming - Head Tracking',
                price: 8990,
                image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
                badge: 'ANC',
                category: 'headsets',
            },
        ];

        await this.productModel.insertMany(products);
        console.log('✅ Seeded 40 products to MongoDB (10 per category)');
    }

    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec();
    }

    async findById(id: string): Promise<Product | null> {
        return this.productModel.findById(id).exec();
    }

    async findByCategory(category: string): Promise<Product[]> {
        return this.productModel.find({ category }).exec();
    }

    async findByName(name: string): Promise<Product[]> {
        return this.productModel
            .find({ name: { $regex: name, $options: 'i' } })
            .exec();
    }

    async create(product: Partial<Product>): Promise<Product> {
        const newProduct = new this.productModel(product);
        return newProduct.save();
    }

    async update(id: string, product: Partial<Product>): Promise<Product | null> {
        return this.productModel.findByIdAndUpdate(id, product, { new: true }).exec();
    }

    async delete(id: string): Promise<Product | null> {
        return this.productModel.findByIdAndDelete(id).exec();
    }
}
