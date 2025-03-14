import { Col } from "sequelize/types/utils";
import { Entity, Column, PrimaryColumn } from "typeorm";

enum TurnoverType {
    SMALL = 'SMALL',
    LARGE = 'LARGE',
}

enum OwnershipType {
    PROPRIETARY = 'PROPRIETARY',
    PARTNERSHIP = 'PARTNERSHIP',
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC',
    LLP = 'LLP',
    SOCIETY = 'SOCIETY',
    TRUST = 'TRUST',
    GOVT = 'GOVT',
}

enum Language {
    English = 'English',
    Spanish = 'Spanish',
    French = 'French',
    German = 'German',
    Mandarin = 'Mandarin',
    Hindi = 'Hindi',
    Arabic = 'Arabic',
    Russian = 'Russian',
    Japanese = 'Japanese',
}

// @Entity()
export class Seller {

    @Column({ type: "varchar", length: 255 })
    businessname: string;

    @Column({ type: "varchar", length: 255 })
    settlementAccountName: string;

    @PrimaryColumn()
    @Column({type: "varchar", length: 255})
    sellerIdentifier: string;

    @Column({ type: "varchar", length: 15, unique: true })
    mobileNumber: string;

    @Column({ type: "varchar", length: 30 })
    emailId: string;

    @Column({ type: "int" })
    mcc: number;

    @Column({ type: "enum", enum: TurnoverType })
    turnoverType: string;

    @Column({ type: "enum", enum: ['ONLINE', 'OFFLINE'] })
    acceptanceType: string;

    @Column({ type: "enum", enum: OwnershipType })
    ownershipType: string;

    @Column({ type: "varchar", length: 255 })
    city: string;

    @Column({ type: "varchar", length: 255 })
    district: string;

    @Column({ type: "varchar", length: 255 })
    stateCode: string;

    @Column({ type: "varchar", length: 255 })
    pinCode: string;

    @Column({ type: "varchar", length: 255 })
    pan: string;

    @Column({ type: "varchar", length: 255 })
    gstNumber: string;

    @Column({ type: "varchar", length: 255 })
    settlementAccountNumber: string;

    @Column({ type: "varchar", length: 255 })
    settlementIFSC: string;

    @Column({ type: "decimal", precision: 10, scale: 8 })
    latitude: number;

    @Column({ type: "decimal", precision: 11, scale: 8 })
    longitude: number;

    @Column({ type: "varchar", length: 255 })
    addressLine1: string;

    @Column({ type: "varchar", length: 255 })
    addressLine2: string;

    @Column({ type: "varchar", length: 255 })
    llpInOrCin: string;

    @Column({ type: "varchar", length: 255 })
    udyogAadhaar: string;

    @Column({ type: "date" })
    dob: Date;

    @Column({ type: "date" })
    doi: Date;

    @Column({ type: "varchar", length: 255 })
    electricityBoardCode: string;

    @Column({ type: "varchar", length: 255 })
    apiKey: string;


    @Column({type: "varchar", length:1500})
    hash: string;

    constructor(){

    }


}
