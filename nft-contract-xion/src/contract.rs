#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::{ContractError, QueryError};
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{Config, Nft, CONFIG, NFTS, NFT_ID_COUNTER};


// version info for migration info
const CONTRACT_NAME: &str = "crates.io:nft-contract";
const CONTRACT_VERSION: &str = "0.1.0";


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    let config = Config {
        owner: info.sender,
    };

    CONFIG.save(deps.storage, &config)?;

    NFT_ID_COUNTER.save(deps.storage, &0)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::MintNft { uri, price } => mint_nft(deps, info, uri, price),
        ExecuteMsg::Rent { nft_id } => rent(deps, info, nft_id)
    }
}

pub fn mint_nft(
    deps: DepsMut,
    info: MessageInfo,
    uri: String,
    price: u128,
) -> Result<Response, ContractError> {

    let mut nft_id = NFT_ID_COUNTER.load(deps.storage)?;
    NFTS.save(deps.storage, nft_id, &Nft {
        nft_id,
        owner: info.sender,
        times_watched: 0,
        price,
        uri,
    })?;
    nft_id += 1;
    NFT_ID_COUNTER.save(deps.storage, &nft_id)?;

    Ok(Response::default())
}

pub fn rent (
    deps: DepsMut,
    info: MessageInfo,
    nft_id: u64
) -> Result<Response, ContractError> {
    if nft_id > NFT_ID_COUNTER.load(deps.storage)? {
        return Err(ContractError::InvalidTokenId {  });
    }
    let mut nft = NFTS.load(deps.storage, nft_id)?;
    let price = nft.price;
    let payment = info.funds.iter().find(|coin| coin.denom == "uxion");

    if payment.map_or(true, |c| c.amount.u128() < price) {
        return Err(ContractError::NotEnoughXion {  });
    }

    nft.times_watched += 1;
    NFTS.save(deps.storage, nft_id, &nft)?;
    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetNft { id } => to_json_binary(&query_nft(deps, id)),
        QueryMsg::GetNftCounter {  } => to_json_binary(&query_nft_id_counter(deps)?),
        QueryMsg::GetOwner {  } => to_json_binary(&query_contract_owner(deps)?),
    }
}

pub fn query_nft(deps: Deps, id: u64) -> Result<Nft, QueryError> {
    NFTS.load(deps.storage, id).map_err(|_| QueryError::InvalidTokenId {  })
}

pub fn query_nft_id_counter(deps: Deps) -> StdResult<u64> {
    NFT_ID_COUNTER.load(deps.storage)
}

pub fn query_contract_owner(deps: Deps) -> StdResult<Config> {
    CONFIG.load(deps.storage)
}

