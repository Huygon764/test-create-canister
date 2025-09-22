#!/usr/bin/env node

// Simple script to demonstrate canister creation
// This uses the compiled JavaScript instead of TypeScript

const { CanisterManager } = require('./dist/canister-manager');

async function demo() {
  console.log('🚀 IC Canister Demo Starting...\n');
  
  try {
    const manager = new CanisterManager();
    
    // Test creating a canister
    console.log('1. Testing canister creation...');
    const canisterId = await manager.createCanister();
    
    console.log('\n✅ Demo completed successfully!');
    console.log('📝 Your new canister ID:', canisterId.toString());
    console.log('\n💡 Next steps:');
    console.log('   1. Save this canister ID');
    console.log('   2. Place your .wasm file in the wasm/ directory');
    console.log('   3. Run: npm run deploy <canister-id> ./wasm/your-file.wasm');
    
  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
    
    if (error.message.includes('Insufficient cycles') || error.message.includes('cycles')) {
      console.log('\n💡 You need cycles to create canisters. Options:');
      console.log('   - Get free cycles from the cycles faucet');
      console.log('   - Convert ICP to cycles');
      console.log('   - Use dfx with local replica for testing');
    }
    
    if (error.message.includes('Unauthorized')) {
      console.log('\n💡 Authentication required. Make sure you have:');
      console.log('   - A valid identity configured');
      console.log('   - Sufficient permissions');
    }
  }
}

demo();
