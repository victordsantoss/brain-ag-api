import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Farm } from './farm.entity';

@Entity({ name: 'tb_address' })
export class Address {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'ID único do endereço (UUID)',
  })
  id: string;

  @Column({
    name: 'street',
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: 'Nome da rua',
  })
  street: string;

  @Column({
    name: 'number',
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'Número do endereço',
  })
  number: string;

  @Column({
    name: 'complement',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Complemento do endereço',
  })
  complement: string;

  @Column({
    name: 'neighborhood',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Bairro',
  })
  neighborhood: string;

  @Column({
    name: 'city',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Cidade',
  })
  city: string;

  @Column({
    name: 'state',
    type: 'varchar',
    length: 2,
    nullable: false,
    comment: 'Estado (UF)',
  })
  state: string;

  @Column({
    name: 'zip_code',
    type: 'varchar',
    length: 8,
    nullable: false,
    comment: 'CEP (apenas números)',
  })
  zipCode: string;

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

  @OneToOne(() => Farm, (farm) => farm.address)
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;
}
