import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  excerpt!: string;

  @Column({ type: 'varchar', length: 255, default: 'Admin' })
  author!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImage!: string | null;

  @Column({ type: 'boolean', default: false })
  published!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlugAndExcerpt() {
    if (this.title) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    if (this.content) {
      this.excerpt = this.content.replace(/<[^>]*>/g, '').substring(0, 150);
    }
  }
}
