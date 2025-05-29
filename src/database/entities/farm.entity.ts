import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Producer } from './producer.entity';
import { Harvest } from './harvest.entity';
import { Address } from './address.entity';
import { BaseEntityStatus } from '../../common/enums/status.enum';

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
    name: 'total_area',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Área total da fazenda em hectares',
  })
  totalArea: number;

  @Column({
    name: 'arable_area',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Área agricultável da fazenda em hectares',
  })
  arableArea: number;

  @Column({
    name: 'vegetation_area',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Área de vegetação da fazenda em hectares',
  })
  vegetationArea: number;

  @Column({
    name: 'status',
    type: 'varchar',
    default: BaseEntityStatus.ACTIVE,
  })
  status: BaseEntityStatus;

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

  @OneToOne(() => Address, (address) => address.farm)
  address: Address;
}
