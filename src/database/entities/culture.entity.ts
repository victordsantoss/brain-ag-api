import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Harvest } from './harvest.entity';
import { Farm } from './farm.entity';

@Entity({ name: 'tb_culture' })
@Unique(['name', 'farm'])
export class Culture {
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

  @OneToMany(() => Harvest, (harvest) => harvest.culture)
  harvests: Harvest[];

  @ManyToOne(() => Farm, (farm) => farm.cultures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'id_farm',
    referencedColumnName: 'id',
  })
  farm: Farm;
}
