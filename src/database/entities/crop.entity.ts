import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Harvest } from './harvest.entity';

@Entity({ name: 'tb_crop' })
export class Crop {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'ID único da cultura (UUID)',
  })
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Nome da cultura',
  })
  name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    comment: 'Descrição detalhada da cultura',
  })
  description: string;

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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Data e hora da exclusão lógica do registro',
  })
  deletedAt: Date;

  /**
   * RELACIONAMENTOS
   */

  @OneToMany(() => Harvest, (harvest) => harvest.crop)
  harvests: Harvest[];
}
