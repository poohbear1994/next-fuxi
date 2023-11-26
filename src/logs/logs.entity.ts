import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  data: string;

  @Column()
  result: number;
}

export default Logs;
