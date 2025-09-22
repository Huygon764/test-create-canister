import { CanisterManager } from './canister-manager';

async function createCanisterDemo() {
    console.log('🚀 Creating Canister with TypeScript + @dfinity packages');
    console.log('====================================================');
    console.log('Host: http://127.0.0.1:4943');
    console.log('Method: provisionalCreateCanisterWithCycles');
    console.log('');

    try {
        // Create canister manager instance for local development
        const manager = new CanisterManager(true);
        
        console.log('✅ CanisterManager initialized');
        console.log('✅ Connected to local DFX replica on port 4943');
        console.log('');
        
        // Create canister using provisional function with cycles
        console.log('📡 Calling provisionalCreateCanisterWithCycles...');
        const canisterId = await manager.provisionalCreateCanisterWithCycles();
        
        console.log('');
        console.log('🎉 SUCCESS! Canister created successfully!');
        console.log('=====================================');
        console.log('Canister ID:', canisterId.toString());
        console.log('');
        console.log('✅ TypeScript + @dfinity packages: WORKING!');
        console.log('✅ No DFX commands needed!');
        console.log('✅ Pure package-based solution!');
        console.log('');
        console.log('🔍 Verify with: dfx canister status', canisterId.toString(), '--network local');
        
        return canisterId;
        
    } catch (error) {
        console.error('');
        console.error('❌ Canister creation failed:');
        console.error('Error:', error);
        
        if (error instanceof Error) {
            if (error.message.includes('subnet')) {
                console.error('');
                console.error('💡 Subnet error - try restarting DFX:');
                console.error('   dfx stop && dfx start --clean');
            } else if (error.message.includes('connection')) {
                console.error('');
                console.error('💡 Connection error - ensure DFX is running on port 4943:');
                console.error('   dfx start --host 127.0.0.1:4943');
            }
        }
        
        throw error;
    }
}

// Run the demo
if (require.main === module) {
    createCanisterDemo()
        .then((canisterId) => {
            console.log('');
            console.log('🎯 FINAL RESULT: SUCCESS!');
            console.log('Canister ID:', canisterId.toString());
            process.exit(0);
        })
        .catch((error) => {
            console.error('');
            console.error('🎯 FINAL RESULT: FAILED');
            console.error('Check DFX configuration and try again');
            process.exit(1);
        });
}

export { createCanisterDemo };
