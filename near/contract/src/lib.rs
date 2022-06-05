use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, AccountId, Timestamp, BorshStorageKey,};
use near_sdk::collections::LookupMap;

// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    pub owner_id: AccountId,
    //keeps track of all the token IDs for a given account
    pub guesses_per_owner: LookupMap<AccountId, Timestamp>,
}

#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKey {
    GuessByOwnerId,
}

impl Default for Contract {
    fn default() -> Self {
        near_sdk::env::panic_str("Contract should be initialized before the usage.")
    }
}

// Implement the contract structure
#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        let this = Self {
            guesses_per_owner: LookupMap::new(StorageKey::GuessByOwnerId),
            owner_id,
        };

        this
    }

    pub fn get_user_last_guess(&self, owner_id: AccountId) -> Option<Timestamp> {
        return self.guesses_per_owner.get(&owner_id);
    }

    pub fn set_user_last_guess(&mut self, owner_id: AccountId, timestamp: Timestamp) {
        self.guesses_per_owner.insert(&owner_id, &timestamp);
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::{testing_env};

    use super::*;

    fn get_context(predecessor_account_id: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id(accounts(0))
            .signer_account_id(predecessor_account_id.clone())
            .predecessor_account_id(predecessor_account_id);
        builder
    }

    #[test]
    fn test_new() {
        let context = get_context(accounts(1));
        testing_env!(context.build());
        let mut contract = Contract::new(accounts(1).into());

        assert_eq!(contract.get_user_last_guess(accounts(1).into()), None);

        contract.set_user_last_guess(accounts(1).into(), 1654414023158);
        assert_eq!(contract.get_user_last_guess(accounts(1).into()).unwrap(), 1654414023158);

        contract.set_user_last_guess(accounts(1).into(), 1654414023200);
        assert_eq!(contract.get_user_last_guess(accounts(1).into()).unwrap(), 1654414023200);
    }
}
