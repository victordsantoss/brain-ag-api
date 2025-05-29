import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';
import { Crop } from './crop.entity';
import { HarvestSeason } from '../../common/enums/harvest-season.enum';

@Entity({ name: 'tb_harvest' })
export class Harvest {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'ID único da safra (UUID)',
  })
  id: string;

  @Column({
    name: 'year',
    type: 'int',
    nullable: false,
    comment: 'Ano da safra',
  })
  year: number;

  @Column({
    name: 'season',
    type: 'enum',
    enum: HarvestSeason,
    nullable: false,
    comment:
      'Estação da safra (VERÃO, INVERNO, PRIMAVERA, OUTONO, PRIMEIRA SAFRA, SEGUNDA SAFRA)',
  })
  season: HarvestSeason;

  @Column({
    name: 'area',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Área plantada em hectares',
  })
  area: number;

  @Column({
    name: 'expected_production',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Produção esperada em toneladas',
  })
  expectedProduction: number;

  @Column({
    name: 'actual_production',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Produção real em toneladas',
  })
  actualProduction: number;

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

  @ManyToOne(() => Farm, (farm) => farm.harvests, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'id_far',
    referencedColumnName: 'id',
  })
  farm: Farm;

  @ManyToOne(() => Crop, (crop) => crop.harvests, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'id_crop',
    referencedColumnName: 'id',
  })
  crop: Crop;
}
