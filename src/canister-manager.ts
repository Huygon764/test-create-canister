import { HttpAgent } from '@dfinity/agent';
import { ICManagementCanister } from '@dfinity/ic-management';
import { Principal } from '@dfinity/principal';

// Configuration
const LOCAL_HOST = 'http://127.0.0.1:8080'; // Local DFX replica
const MAINNET_HOST = 'https://ic0.app'; // For mainnet
const IDENTITY_PROVIDER = 'https://identity.ic0.app';

export class CanisterManager {
  private agent: HttpAgent;
  private management: ICManagementCanister;
  private isLocal: boolean;

  constructor(useLocal: boolean = true) {
    this.isLocal = useLocal;
    const host = useLocal ? LOCAL_HOST : MAINNET_HOST;
    
    // Create HTTP Agent
    this.agent = new HttpAgent({
      host,
    });

    // For local development, disable certificate verification
    if (useLocal) {
      this.agent.fetchRootKey().catch(err => {
        console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
        console.error(err);
      });
    }

    // Initialize IC Management Canister
    this.management = ICManagementCanister.create({
      agent: this.agent,
    });
  }

  async createCanister(): Promise<Principal> {
    try {
      console.log('Creating new canister...');
      
      const result = await this.management.createCanister({
        settings: {
          controllers: [], // Empty means the caller becomes the controller
        },
      });

      console.log('Canister created successfully!');
      console.log('Canister ID:', result.toString());
      
      return result;
    } catch (error) {
      console.error('Error creating canister:', error);
      throw error;
    }
  }

  // Provisional function for local development - creates canister with cycles
  async provisionalCreateCanisterWithCycles(cycles?: bigint): Promise<Principal> {
    try {
      console.log('Creating canister with provisional function...');
      
      if (!this.isLocal) {
        throw new Error('Provisional functions only work on local replica');
      }

      // Use provisional_create_canister_with_cycles for local development
      const defaultCycles = BigInt(1_000_000_000_000); // 1T cycles
      const cyclesToUse = cycles || defaultCycles;
      
      console.log('Using cycles:', cyclesToUse.toString());
      
      const result = await this.management.provisionalCreateCanisterWithCycles({
        amount: cyclesToUse,
      });

      console.log('Canister created successfully with provisional function!');
      console.log('Canister ID:', result.toString());
      
      return result;
    } catch (error) {
      console.error('Error creating canister with provisional function:', error);
      
      // Fallback to regular create canister for local
      console.log('Trying fallback method...');
      try {
        const fallbackResult = await this.createCanister();
        return fallbackResult;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw error;
      }
    }
  }

  async installCode(canisterId: Principal, wasmModule: Uint8Array, args?: Uint8Array): Promise<void> {
    try {
      console.log('Installing code to canister:', canisterId.toString());
      
      await this.management.installCode({
        mode: { install: null },
        canisterId: canisterId,
        wasmModule: wasmModule,
        arg: args || new Uint8Array(),
      });

      console.log('Code installed successfully!');
    } catch (error) {
      console.error('Error installing code:', error);
      throw error;
    }
  }

  async upgradeCode(canisterId: Principal, wasmModule: Uint8Array, args?: Uint8Array): Promise<void> {
    try {
      console.log('Upgrading code on canister:', canisterId.toString());
      
      await this.management.installCode({
        mode: { upgrade: [] },
        canisterId: canisterId,
        wasmModule: wasmModule,
        arg: args || new Uint8Array(),
      });

      console.log('Code upgraded successfully!');
    } catch (error) {
      console.error('Error upgrading code:', error);
      throw error;
    }
  }

  async startCanister(canisterId: Principal): Promise<void> {
    try {
      console.log('Starting canister:', canisterId.toString());
      
      await this.management.startCanister(canisterId);

      console.log('Canister started successfully!');
    } catch (error) {
      console.error('Error starting canister:', error);
      throw error;
    }
  }

  async stopCanister(canisterId: Principal): Promise<void> {
    try {
      console.log('Stopping canister:', canisterId.toString());
      
      await this.management.stopCanister(canisterId);

      console.log('Canister stopped successfully!');
    } catch (error) {
      console.error('Error stopping canister:', error);
      throw error;
    }
  }

  async getCanisterStatus(canisterId: Principal): Promise<any> {
    try {
      console.log('Getting canister status:', canisterId.toString());
      
      const status = await this.management.canisterStatus(canisterId);

      console.log('Canister status:', status);
      return status;
    } catch (error) {
      console.error('Error getting canister status:', error);
      throw error;
    }
  }

  async deleteCanister(canisterId: Principal): Promise<void> {
    try {
      console.log('Deleting canister:', canisterId.toString());
      
      await this.management.deleteCanister(canisterId);

      console.log('Canister deleted successfully!');
    } catch (error) {
      console.error('Error deleting canister:', error);
      throw error;
    }
  }
}
