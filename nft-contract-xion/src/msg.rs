use cosmwasm_schema::{cw_serde, QueryResponses};
use crate::state::{Config, Nft};

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    MintNft {uri: String, price: u128},
    Rent {nft_id: u64},
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {

    #[returns(Nft)]
    GetNft {id: u64},

    #[returns(u64)]
    GetNftCounter {},

    #[returns(Config)]
    GetOwner {},
}
