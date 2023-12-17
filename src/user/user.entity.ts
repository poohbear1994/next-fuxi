import Logs from 'src/logs/logs.entity';
import Roles from 'src/roles/roles.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Profile from './profile.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  // 设置username为唯一值，禁止用户名重复
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Logs, (log) => log.user)
  logs: Logs[];

  @ManyToMany(() => Roles, (role) => role.users)
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;
}

export default User;
