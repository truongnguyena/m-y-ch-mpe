import { Injectable, signal } from '@angular/core';

export type ProductItem = {
  id: number;
  name: string;
  priceVnd: number;
  image: string;
  category: 'Figure' | 'Poster' | 'Áo thun' | 'Phụ kiện';
  description: string;
};

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly productsSignal = signal<ProductItem[]>([
    {
      id: 1,
      name: 'Figure Tanjiro Kamado 1/8',
      priceVnd: 1299000,
      image: 'https://images.unsplash.com/photo-1598403031653-6f6aa9f71ce2?q=80&w=800&auto=format&fit=crop',
      category: 'Figure',
      description: 'Figure chi tiết cao, chất lượng cao, từ Demon Slayer.'
    },
    {
      id: 2,
      name: 'Poster One Piece Wano',
      priceVnd: 99000,
      image: 'https://images.unsplash.com/photo-1544551763-7ef420be2a07?q=80&w=800&auto=format&fit=crop',
      category: 'Poster',
      description: 'Poster in sắc nét khổ A2, chủ đề Wano.'
    },
    {
      id: 3,
      name: 'Áo thun Gojo Satoru',
      priceVnd: 249000,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
      category: 'Áo thun',
      description: 'Áo thun cotton 100% in hình Gojo, form unisex.'
    },
    {
      id: 4,
      name: 'Móc khóa Chibi Naruto',
      priceVnd: 59000,
      image: 'https://images.unsplash.com/photo-1590650046871-92c887180603?q=80&w=800&auto=format&fit=crop',
      category: 'Phụ kiện',
      description: 'Móc khóa acrylic chibi Naruto dễ thương.'
    }
  ]);

  list = () => this.productsSignal.asReadonly();
  getById = (id: number) => this.productsSignal().find(p => p.id === id);
}
