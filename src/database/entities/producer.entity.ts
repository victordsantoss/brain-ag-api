import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Farm } from './farm.entity';

@Entity({ name: 'tb_producer' })
export class Producer {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'ID único do produtor (UUID)',
  })
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Nome completo do produtor',
  })
  name: string;

  @Column({
    name: 'cpf',
    type: 'varchar',
    length: 11,
    nullable: false,
    unique: true,
    comment: 'CPF do produtor (apenas números)',
  })
  cpf: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
    comment: 'Email do produtor',
  })
  email: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: 'Telefone do produtor',
  })
  phone: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Data e hora de criação do registro',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Data e hora da última atualização do registro',
  })
  updatedAt: Date;

  /**
   * RELACIONAMENTOS
   */

  @OneToMany(() => Farm, (farm) => farm.producer)
  farms: Farm[];
}
