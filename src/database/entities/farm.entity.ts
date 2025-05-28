import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Producer } from './producer.entity';
import { Harvest } from './harvest.entity';

@Entity({ name: 'tb_farm' })
export class Farm {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'ID único da fazenda (UUID)',
  })
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Nome da fazenda',
  })
  name: string;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: 'Endereço completo da fazenda',
  })
  address: string;

  @Column({
    name: 'city',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Cidade onde está localizada a fazenda',
  })
  city: string;

  @Column({
    name: 'state',
    type: 'varchar',
    length: 2,
    nullable: false,
    comment: 'Estado onde está localizada a fazenda (UF)',
  })
  state: string;

  @Column({
    name: 'area',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Área total da fazenda em hectares',
  })
  area: number;

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

  @ManyToOne(() => Producer, (producer) => producer.farms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'producer_id',
    referencedColumnName: 'id',
  })
  producer: Producer;

  @OneToMany(() => Harvest, (harvest) => harvest.farm)
  harvests: Harvest[];
}
