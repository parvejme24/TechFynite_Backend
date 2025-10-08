import { ValidateLicenseInput, RevokeLicenseInput, License, PaginatedLicenses, LicenseStats, LicenseQuery, LicenseValidationResult } from "./license.type";
export declare class LicenseService {
    getAllLicenses(query: LicenseQuery): Promise<PaginatedLicenses>;
    getLicenseById(id: string): Promise<License | null>;
    validateLicense(data: ValidateLicenseInput): Promise<LicenseValidationResult>;
    revokeLicense(id: string, data: RevokeLicenseInput): Promise<{
        success: boolean;
        message: string;
    }>;
    getLicenseStats(): Promise<LicenseStats>;
    getUserLicenses(userId: string, query: Omit<LicenseQuery, 'userId'>): Promise<PaginatedLicenses>;
}
//# sourceMappingURL=license.service.d.ts.map