import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop()
    oldPrice?: number;

    @Prop({ required: true })
    image: string;

    @Prop()
    badge?: string;

    @Prop()
    category?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
