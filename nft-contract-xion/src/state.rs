use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

pub const CONFIG: Item<Config> = Item::new("config");
pub const NFT_ID_COUNTER: Item<u64> = Item::new("nft_id_counter");
pub const NFTS: Map<u64, Nft> = Map::new("nfts");

#[derive(Deserialize, Serialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Config {
    pub owner: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Nft {
    pub nft_id: u64,
    pub owner: Addr,
    pub times_watched: u64,
    pub price: u128,
    pub uri: String,
}
