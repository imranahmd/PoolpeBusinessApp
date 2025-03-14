import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

enum TurnoverType {
    SMALL = 'SMALL',
    LARGE = 'LARGE',
}

enum AcceptanceType {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
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

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    sellerIdentifier: string;

    @Column({ type: "varchar", length: 255 })
    businessname: string;

    @Column({ type: "varchar", length: 255 })
    settlementAccountName: string;

    @Column({ type: "varchar", length: 15 })
    mobileNumber: string;

    @Column({ type: "varchar", length: 30 })
    emailId: string;

    @Column({ type: "int" })
    mcc: number;

    @Column({ type: "enum", enum: TurnoverType })
    turnoverType: string;

    @Column({ type: "enum", enum: AcceptanceType })
    acceptanceType: string;

    @Column({ type: "enum", enum: OwnershipType })
    ownershipType: string;

    @Column({ type: "varchar", length: 255 })
    city: string;

    @Column({ type: "varchar", length: 255 })
    district: string;

    @Column({ type: "varchar", length: 255 })
    stateCode: string;

    @Column({ type: "varchar", length: 6 })
    pinCode: string;

    @Column({ type: "varchar", length: 10 })
    pan: string;

    @Column({ type: "varchar", length: 15 })
    gstNumber: string;

    @Column({ type: "varchar", length: 20 })
    settlementAccountNumber: string;

    @Column({ type: "varchar", length: 11 })
    settlementIFSC: string;

    @Column({ type: "decimal", precision: 10, scale: 8 })
    latitude: number;

    @Column({ type: "decimal", precision: 11, scale: 8 })
    longitude: number;

    @Column({ type: "varchar", length: 255 })
    addressLine1: string;

    @Column({ type: "varchar", length: 255 })
    addressLine2: string;

    @Column({ type: "varchar", length: 21 })
    llpInOrCin: string;

    @Column({ type: "varchar", length: 12 })
    udyogAadhaar: string;

    @Column({ type: "date" })
    dob: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    doi: string; // Assuming date of incorporation if ownership type is not proprietary

    @Column({ type: "varchar", length: 255, nullable: true })
    electricityBoardCode: string; // Optional and not mandatory

    @Column({ type: "varchar", length: 255 })
    apiKey: string;

    @Column({ type: "varchar", length: 255 })
    hash: string;

    @Column({ type: "text" })
    qrString: string;

     @Column({ type: "mediumblob" })
     panDocument: Buffer;

     @Column({ type: "mediumblob" })
     profilePhoto: Buffer;

     @Column({ type: "varchar", length: 50})
     profilePhotoFileType: string;

     @Column({ type: "varchar"})
     panFileType: string;

}
