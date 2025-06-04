import { 
  IExec, 
  utils, 
  errors 
} from 'iexec';
import { 
  IExecDataProtectorCore, 
  IExecDataProtectorSharing,
  createArrayBufferFromFile,
  type ProtectDataParams,
  type GrantAccessParams,
  type ProcessProtectedDataParams,
  type GetProtectedDataParams,
  type GetGrantedAccessParams,
  type RevokeAccessParams,
  type ConsumeProtectedDataParams,
  type ProtectedDataWithSecretProps,
  type ProtectedData,
  type GrantedAccess,
  type ProcessProtectedDataResponse,
  type OnStatusUpdateFn,
  type DataObject,
  type SearchableDataSchema,
  type AddressOrENS
} from '@iexec/dataprotector';
import { ethers, Wallet, providers } from 'ethers';

// Enhanced Types for better type safety
export interface UserData {
  id: string;
  encryptedData: string;
  metadata: Record<string, any>;
  dataType: 'verification' | 'message' | 'financial' | 'voting' | 'file' | 'general';
  timestamp: number;
}

export interface ProtectedDataInfo extends ProtectedData {
  dataType?: UserData['dataType'];
  isDebugAllowed?: boolean;
}

export interface AccessGrant {
  protectedData: string;
  authorizedApp: string;
  authorizedUser: string;
  pricePerAccess?: number;
  numberOfAccess?: number;
}

export interface SharingCollection {
  id: number;
  name: string;
  description: string;
  protectedDataList: string[];
  sharingModel: 'rental' | 'subscription' | 'sale';
  price: number;
  duration?: number;
}

export interface ProcessingResult {
  taskId: string;
  dealId: string;
  txHash: string;
  result?: ArrayBuffer;
  status: 'completed' | 'failed' | 'pending';
  logs?: string[];
}

export interface IExecConfig {
  ethProvider: providers.Provider | any; // Support browser window.ethereum
  privateKey?: string;
  signer?: ethers.Signer;
  chainId?: number;
  workerpoolAddress?: string;
  appAddress?: string;
  iexecOptions?: {
    smsURL?: string; // For TDX support
    resultProxyURL?: string;
  };
}

export interface FileProtectionOptions {
  file: File;
  name?: string;
  allowDebug?: boolean;
  onStatusUpdate?: OnStatusUpdateFn<any>;
}

export interface ArrayProtectionOptions {
  array: Array<any>;
  name?: string;
  allowDebug?: boolean;
  onStatusUpdate?: OnStatusUpdateFn<any>;
}

export interface DataAccessFilter {
  protectedDataAddress?: string;
  owner?: string;
  requiredSchema?: SearchableDataSchema;
  createdAfterTimestamp?: number;
  page?: number;
  pageSize?: number;
}

export interface AccessFilter {
  protectedData?: string;
  authorizedApp?: string;
  authorizedUser?: string;
  isUserStrict?: boolean;
  page?: number;
  pageSize?: number;
}

export class IExecServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'IExecServiceError';
  }
}

export class EnhancedIExecService {
  private iexec: IExec;
  private dataProtectorCore: IExecDataProtectorCore;
  private dataProtectorSharing: IExecDataProtectorSharing;
  private config: IExecConfig;
  private isInitialized = false;

  constructor(config: IExecConfig) {
    this.config = {
      chainId: 134, // Bellecour by default
      ...config
    };
    this.validateConfig(this.config);
  }

  /**
   * Initialize the iExec service with DataProtector modules
   */
  public async initialize(): Promise<void> {
    try {
      // Initialize main iExec instance
      this.iexec = new IExec({
        ethProvider: this.config.ethProvider,
        chainId: this.config.chainId,
      });

      // Initialize DataProtector Core with proper parameters
      this.dataProtectorCore = new IExecDataProtectorCore(
        this.config.ethProvider,
        {
          ...(this.config.iexecOptions && { iexecOptions: this.config.iexecOptions }),
        }
      );

      // Initialize DataProtector Sharing
      this.dataProtectorSharing = new IExecDataProtectorSharing(
        this.config.ethProvider,
        {
          ...(this.config.iexecOptions && { iexecOptions: this.config.iexecOptions }),
        }
      );

      // Verify initialization
      await this.verifyInitialization();
      this.isInitialized = true;

      console.log('Enhanced iExec Service initialized successfully');
    } catch (error) {
      throw new IExecServiceError(
        'Failed to initialize iExec service',
        'INIT_ERROR',
        error as Error
      );
    }
  }

  // ===== ENHANCED DATAPROTECTOR CORE METHODS =====

  /**
   * Protect any type of data with comprehensive options
   */
  public async protectData(
    data: DataObject,
    options: {
      name?: string;
      allowDebug?: boolean;
      onStatusUpdate?: OnStatusUpdateFn<any>;
    } = {}
  ): Promise<ProtectedDataWithSecretProps> {
    this.ensureInitialized();

    try {
      const protectParams: ProtectDataParams = {
        data,
        name: options.name || 'Untitled',
        allowDebug: options.allowDebug || false,
        ...(options.onStatusUpdate && { onStatusUpdate: options.onStatusUpdate }),
      };

      const result = await this.dataProtectorCore.protectData(protectParams);

      console.log(`Data protected successfully: ${result.address}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to protect data',
        'PROTECT_ERROR',
        error as Error
      );
    }
  }

  /**
   * Protect file data with proper conversion
   */
  public async protectFile(options: FileProtectionOptions): Promise<ProtectedDataWithSecretProps> {
    this.ensureInitialized();

    try {
      const fileAsArrayBuffer = await createArrayBufferFromFile(options.file);
      
      const data: DataObject = {
        file: fileAsArrayBuffer
      };

      return await this.protectData(data, {
        name: options.name || options.file.name,
        allowDebug: options.allowDebug,
        onStatusUpdate: options.onStatusUpdate,
      });
    } catch (error) {
      throw new IExecServiceError(
        'Failed to protect file',
        'PROTECT_FILE_ERROR',
        error as Error
      );
    }
  }

  /**
   * Protect array data with proper conversion
   */
  public async protectArray(options: ArrayProtectionOptions): Promise<ProtectedDataWithSecretProps> {
    this.ensureInitialized();

    try {
      // Convert array to Record<string, any> as specified in docs
      const reduceArray = (array: Array<any>): Record<string, any> =>
        array.reduce((accumulator, current, i) => {
          accumulator[i] = current;
          return accumulator;
        }, {});

      const data: DataObject = {
        arrayData: reduceArray(options.array)
      };

      return await this.protectData(data, {
        name: options.name || 'Array Data',
        allowDebug: options.allowDebug,
        onStatusUpdate: options.onStatusUpdate,
      });
    } catch (error) {
      throw new IExecServiceError(
        'Failed to protect array',
        'PROTECT_ARRAY_ERROR',
        error as Error
      );
    }
  }

  /**
   * Get protected data with comprehensive filtering
   */
  public async getProtectedData(filter: DataAccessFilter = {}): Promise<ProtectedData[]> {
    this.ensureInitialized();

    try {
      const params: GetProtectedDataParams = {
        ...(filter.protectedDataAddress && { protectedDataAddress: filter.protectedDataAddress }),
        ...(filter.owner && { owner: filter.owner }),
        ...(filter.requiredSchema && { requiredSchema: filter.requiredSchema }),
        ...(filter.createdAfterTimestamp && { createdAfterTimestamp: filter.createdAfterTimestamp }),
        page: filter.page || 0,
        pageSize: filter.pageSize || 1000,
      };

      const result = await this.dataProtectorCore.getProtectedData(params);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to get protected data',
        'GET_PROTECTED_DATA_ERROR',
        error as Error
      );
    }
  }

  /**
   * Transfer ownership of protected data
   */
  public async transferDataOwnership(
    protectedDataAddress: string,
    newOwner: string
  ): Promise<{ txHash: string }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorCore.transferOwnership({
        protectedData: protectedDataAddress,
        newOwner,
      });

      console.log(`Ownership transferred for ${protectedDataAddress} to ${newOwner}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to transfer ownership',
        'TRANSFER_OWNERSHIP_ERROR',
        error as Error
      );
    }
  }

  /**
   * Grant access with comprehensive options
   */
  public async grantAccess(
    protectedDataAddress: string,
    authorizedApp: string,
    authorizedUser: string,
    options: {
      pricePerAccess?: number;
      numberOfAccess?: number;
      onStatusUpdate?: OnStatusUpdateFn<any>;
    } = {}
  ): Promise<GrantedAccess> {
    this.ensureInitialized();

    try {
      const grantParams: GrantAccessParams = {
        protectedData: protectedDataAddress,
        authorizedApp,
        authorizedUser,
        pricePerAccess: options.pricePerAccess || 0,
        numberOfAccess: options.numberOfAccess || 1,
        ...(options.onStatusUpdate && { onStatusUpdate: options.onStatusUpdate }),
      };

      const result = await this.dataProtectorCore.grantAccess(grantParams);

      console.log(`Access granted for protected data: ${protectedDataAddress}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to grant access',
        'GRANT_ACCESS_ERROR',
        error as Error
      );
    }
  }

  /**
   * Get granted access with filtering
   */
  public async getGrantedAccess(filter: AccessFilter = {}): Promise<{
    count: number;
    grantedAccess: GrantedAccess[];
  }> {
    this.ensureInitialized();

    try {
      const params: GetGrantedAccessParams = {
        ...(filter.protectedData && { protectedData: filter.protectedData }),
        ...(filter.authorizedApp && { authorizedApp: filter.authorizedApp }),
        ...(filter.authorizedUser && { authorizedUser: filter.authorizedUser }),
        isUserStrict: filter.isUserStrict || false,
        page: filter.page || 0,
        pageSize: filter.pageSize || 20,
      };

      const result = await this.dataProtectorCore.getGrantedAccess(params);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to get granted access',
        'GET_GRANTED_ACCESS_ERROR',
        error as Error
      );
    }
  }

  /**
   * Revoke specific access
   */
  public async revokeOneAccess(
    protectedDataAddress: string,
    authorizedApp: string,
    authorizedUser: string
  ): Promise<{ txHash: string }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorCore.revokeOneAccess({
        protectedData: protectedDataAddress,
        authorizedApp,
        authorizedUser,
      });

      console.log(`Access revoked for ${protectedDataAddress}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to revoke access',
        'REVOKE_ACCESS_ERROR',
        error as Error
      );
    }
  }

  /**
   * Revoke all access for protected data
   */
  public async revokeAllAccess(protectedDataAddress: string): Promise<{ txHash: string }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorCore.revokeAllAccess({
        protectedData: protectedDataAddress,
      });

      console.log(`All access revoked for ${protectedDataAddress}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to revoke all access',
        'REVOKE_ALL_ACCESS_ERROR',
        error as Error
      );
    }
  }

  /**
   * Process protected data with comprehensive options
   */
  public async processProtectedData(
    protectedDataAddress: string,
    appAddress: string,
    options: {
      path?: string;
      userWhitelist?: string;
      maxPrice?: number;
      useVoucher?: boolean;
      voucherOwner?: string;
      args?: string;
      inputFiles?: string[];
      secrets?: Record<number, string>;
      workerpool?: string;
      onStatusUpdate?: OnStatusUpdateFn<any>;
    } = {}
  ): Promise<ProcessProtectedDataResponse> {
    this.ensureInitialized();

    try {
      const processParams: ProcessProtectedDataParams = {
        protectedData: protectedDataAddress,
        app: appAddress,
        ...(options.path && { path: options.path }),
        ...(options.userWhitelist && { userWhitelist: options.userWhitelist }),
        maxPrice: options.maxPrice || 0,
        useVoucher: options.useVoucher || false,
        ...(options.voucherOwner && { voucherOwner: options.voucherOwner }),
        ...(options.args && { args: options.args }),
        ...(options.inputFiles && { inputFiles: options.inputFiles }),
        ...(options.secrets && { secrets: options.secrets }),
        workerpool: options.workerpool || 'prod-v8-bellecour.main.pools.iexec.eth',
        ...(options.onStatusUpdate && { onStatusUpdate: options.onStatusUpdate }),
      };

      const result = await this.dataProtectorCore.processProtectedData(processParams);

      console.log(`Data processing initiated: ${result.taskId}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to process protected data',
        'PROCESS_ERROR',
        error as Error
      );
    }
  }

  /**
   * Get result from completed task
   */
  public async getResultFromCompletedTask(
    taskId: string,
    options: {
      path?: string;
      pemPrivateKey?: string;
      onStatusUpdate?: OnStatusUpdateFn<any>;
    } = {}
  ): Promise<{ result: ArrayBuffer }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorCore.getResultFromCompletedTask({
        taskId,
        ...(options.path && { path: options.path }),
        ...(options.pemPrivateKey && { pemPrivateKey: options.pemPrivateKey }),
        ...(options.onStatusUpdate && { onStatusUpdate: options.onStatusUpdate }),
      });

      console.log(`Retrieved result for task: ${taskId}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to get task result',
        'GET_TASK_RESULT_ERROR',
        error as Error
      );
    }
  }

  // ===== ENHANCED DATAPROTECTOR SHARING METHODS =====

  /**
   * Create a collection for data sharing
   */
  public async createCollection(): Promise<{ collectionId: number; txHash: string }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorSharing.createCollection();
      console.log(`Collection created: ${result.collectionId}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to create collection',
        'CREATE_COLLECTION_ERROR',
        error as Error
      );
    }
  }

  /**
   * Remove a collection
   */
  public async removeCollection(collectionId: number): Promise<{ txHash: string }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorSharing.removeCollection({ collectionId });
      console.log(`Collection removed: ${collectionId}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to remove collection',
        'REMOVE_COLLECTION_ERROR',
        error as Error
      );
    }
  }

  /**
   * Add protected data to collection
   */
  public async addToCollection(
    collectionId: number,
    protectedDataAddress: string,
    addOnlyAppWhitelist: string,
    onStatusUpdate?: OnStatusUpdateFn<any>
  ): Promise<{ txHash: string }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorSharing.addToCollection({
        collectionId,
        protectedData: protectedDataAddress,
        addOnlyAppWhitelist,
        ...(onStatusUpdate && { onStatusUpdate }),
      });

      console.log(`Protected data added to collection ${collectionId}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to add to collection',
        'ADD_TO_COLLECTION_ERROR',
        error as Error
      );
    }
  }

  /**
   * Remove protected data from collection
   */
  public async removeProtectedDataFromCollection(
    protectedDataAddress: string
  ): Promise<{ txHash: string }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorSharing.removeProtectedDataFromCollection({
        protectedData: protectedDataAddress,
      });

      console.log(`Protected data removed from collection`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to remove from collection',
        'REMOVE_FROM_COLLECTION_ERROR',
        error as Error
      );
    }
  }

  /**
   * Set protected data for renting
   */
  public async setProtectedDataToRenting(
    protectedDataAddress: string,
    price: number,
    duration: number
  ): Promise<{ txHash: string }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorSharing.setProtectedDataToRenting({
        protectedData: protectedDataAddress,
        price,
        duration,
      });

      console.log(`Protected data set for renting: ${protectedDataAddress}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to set for renting',
        'SET_FOR_RENTING_ERROR',
        error as Error
      );
    }
  }

  /**
   * Update renting parameters
   */
  public async setProtectedDataRentingParams(
    protectedDataAddress: string,
    price: number,
    duration: number
  ): Promise<{ txHash: string }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorSharing.setProtectedDataRentingParams({
        protectedData: protectedDataAddress,
        price,
        duration,
      });

      console.log(`Renting params updated for: ${protectedDataAddress}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to update renting params',
        'UPDATE_RENTING_PARAMS_ERROR',
        error as Error
      );
    }
  }

  /**
   * Rent protected data
   */
  public async rentProtectedData(
    protectedDataAddress: string,
    price: number,
    duration: number
  ): Promise<{ txHash: string }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorSharing.rentProtectedData({
        protectedData: protectedDataAddress,
        price,
        duration,
      });

      console.log(`Protected data rented: ${protectedDataAddress}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to rent protected data',
        'RENT_PROTECTED_DATA_ERROR',
        error as Error
      );
    }
  }

  /**
   * Remove protected data from renting
   */
  public async removeProtectedDataFromRenting(
    protectedDataAddress: string
  ): Promise<{ txHash: string }> {
    this.ensureInitialized();

    try {
      const result = await this.dataProtectorSharing.removeProtectedDataFromRenting({
        protectedData: protectedDataAddress,
      });

      console.log(`Protected data removed from renting: ${protectedDataAddress}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to remove from renting',
        'REMOVE_FROM_RENTING_ERROR',
        error as Error
      );
    }
  }

  /**
   * Consume protected data
   */
  public async consumeProtectedData(
    protectedDataAddress: string,
    appAddress: string,
    options: {
      path?: string;
      workerpool?: string;
      maxPrice?: number;
      pemPublicKey?: string;
      pemPrivateKey?: string;
      onStatusUpdate?: OnStatusUpdateFn<any>;
    } = {}
  ): Promise<{
    txHash: string;
    dealId: string;
    taskId: string;
    result: ArrayBuffer;
  }> {
    this.ensureInitialized();

    try {
      const consumeParams: ConsumeProtectedDataParams = {
        protectedData: protectedDataAddress,
        app: appAddress,
        ...(options.path && { path: options.path }),
        workerpool: options.workerpool || 'prod-v8-bellecour.main.pools.iexec.eth',
        maxPrice: options.maxPrice || 0,
        ...(options.pemPublicKey && { pemPublicKey: options.pemPublicKey }),
        ...(options.pemPrivateKey && { pemPrivateKey: options.pemPrivateKey }),
        ...(options.onStatusUpdate && { onStatusUpdate: options.onStatusUpdate }),
      };

      const result = await this.dataProtectorSharing.consumeProtectedData(consumeParams);

      console.log(`Protected data consumed: ${protectedDataAddress}`);
      return result;
    } catch (error) {
      throw new IExecServiceError(
        'Failed to consume protected data',
        'CONSUME_PROTECTED_DATA_ERROR',
        error as Error
      );
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Get current user address
   */
  public async getCurrentUserAddress(): Promise<string> {
    if (this.config.signer) {
      return await this.config.signer.getAddress();
    }
    
    if (this.config.privateKey) {
      const wallet = new Wallet(this.config.privateKey);
      return wallet.address;
    }

    // For browser environment with window.ethereum
    if (this.config.ethProvider?.request) {
      const accounts = await this.config.ethProvider.request({ 
        method: 'eth_accounts' 
      });
      if (accounts && accounts.length > 0) {
        return accounts[0];
      }
    }

    throw new IExecServiceError(
      'Unable to determine user address',
      'ADDRESS_ERROR'
    );
  }

  /**
   * Get user's protected data with optional filtering
   */
  public async getUserProtectedData(filter: Omit<DataAccessFilter, 'owner'> = {}): Promise<ProtectedData[]> {
    this.ensureInitialized();

    try {
      const userAddress = await this.getCurrentUserAddress();
      return await this.getProtectedData({
        ...filter,
        owner: userAddress,
      });
    } catch (error) {
      throw new IExecServiceError(
        'Failed to fetch user protected data',
        'FETCH_USER_DATA_ERROR',
        error as Error
      );
    }
  }

  /**
   * Check if TDX mode is available
   */
  public isTDXModeEnabled(): boolean {
    return !!(this.config.iexecOptions?.smsURL?.includes('labs.iex.ec'));
  }

  /**
   * Get recommended app addresses for common use cases
   */
  public getRecommendedApps(): {
    web3mail: string;
    web3mailWhitelist: string;
    contentDelivery: string;
  } {
    return {
      web3mail: 'web3mail.apps.iexec.eth',
      web3mailWhitelist: '0x781482C39CcE25546583EaC4957Fb7Bf04C277D2',
      contentDelivery: '0x1cb7D4F3FFa203F211e57357D759321C6CE49921',
    };
  }

  /**
   * Create status update callback for monitoring operations
   */
  public createStatusCallback(
    operationName: string,
    onProgress?: (title: string, isDone: boolean) => void
  ): OnStatusUpdateFn<any> {
    return ({ title, isDone }) => {
      console.log(`[${operationName}] ${title}: ${isDone ? 'Done' : 'In Progress'}`);
      if (onProgress) {
        onProgress(title, isDone);
      }
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private validateConfig(config: IExecConfig): void {
    if (!config.ethProvider) {
      throw new IExecServiceError(
        'ETH provider is required',
        'INVALID_CONFIG'
      );
    }
  }

  private async verifyInitialization(): Promise<void> {
    try {
      // Test basic functionality
      await this.getCurrentUserAddress();
    } catch (error) {
      throw new IExecServiceError(
        'Service initialization verification failed',
        'INIT_VERIFICATION_ERROR',
        error as Error
      );
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new IExecServiceError(
        'Service not initialized. Call initialize() first.',
        'NOT_INITIALIZED'
      );
    }
  }

  /**
   * Cleanup resources and connections
   */
  public async cleanup(): Promise<void> {
    try {
      this.isInitialized = false;
      console.log('Enhanced iExec Service cleaned up successfully');
    } catch (error) {
      console.warn('Cleanup warning:', error);
    }
  }
}

// ===== FACTORY FUNCTIONS AND UTILITIES =====

/**
 * Create iExec service with browser support
 */
export const createIExecService = (config: IExecConfig): EnhancedIExecService => {
  return new EnhancedIExecService(config);
};

/**
 * Create iExec service for browser environment
 */
export const createBrowserIExecService = (
  ethProvider: any = window.ethereum,
  options: Partial<IExecConfig> = {}
): EnhancedIExecService => {
  const config: IExecConfig = {
    ethProvider,
    chainId: 134, // Bellecour
    ...options,
  };

  return new EnhancedIExecService(config);
};

/**
 * Create iExec service with TDX support
 */
export const createTDXIExecService = (
  ethProvider: providers.Provider | any,
  options: Partial<IExecConfig> = {}
): EnhancedIExecService => {
  const config: IExecConfig = {
    ethProvider,
    chainId: 134,
    iexecOptions: {
      smsURL: 'https://sms.labs.iex.ec',
    },
    ...options,
  };

  return new EnhancedIExecService(config);
};

/**
 * Utility to convert array to DataProtector-compatible format
 */
export const prepareArrayForProtection = (array: Array<any>): Record<string, any> => {
  return array.reduce((accumulator, current, i) => {
    accumulator[i] = current;
    return accumulator;
  }, {});
};

/**
 * Utility to validate protected data schema
 */
export const validateProtectedDataSchema = (
  data: any,
  requiredFields: string[]
): boolean => {
  try {
    for (const field of requiredFields) {
      if (!(field in data)) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Common data schemas for different use cases
 */
export const CommonSchemas = {
  email: { email: 'string' },
  userData: { 
    userId: 'string',
    data: 'string',
    timestamp: 'f64'
  },
  document: {
    filename: 'string',
    content: 'application/octet-stream',
    hash: 'string'
  },
  verificationData: {
    userId: 'string',
    verificationData: 'string',
    timestamp: 'f64',
    documentHash: 'string'
  }
};

// Export all types
export type {
  UserData,
  ProtectedDataInfo,
  AccessGrant,
  SharingCollection,
  ProcessingResult,
  IExecConfig,
  FileProtectionOptions,
  ArrayProtectionOptions,
  DataAccessFilter,
  AccessFilter,
  ProtectedDataWithSecretProps,
  ProtectedData,
  GrantedAccess,
  ProcessProtectedDataResponse,
  OnStatusUpdateFn,
  DataObject,
  SearchableDataSchema,
  AddressOrENS
};