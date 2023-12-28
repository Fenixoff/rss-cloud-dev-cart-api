import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  constructor(partial?: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  password?: string;
}
