import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Roles {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
}

export default Roles;
