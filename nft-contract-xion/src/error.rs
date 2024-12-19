use cosmwasm_std::StdError;
use thiserror::Error;
use serde::{Deserialize, Serialize};

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Invalid ID")]
    InvalidTokenId {},

    #[error("Not enough amount received")]
    NotEnoughXion {},
    // Add any other custom errors you like here.
    // Look at https://docs.rs/thiserror/1.0.21/thiserror/ for details.
}

#[derive(Error, Debug, Deserialize, Serialize)]
pub enum QueryError {
    #[error("Invalid ID")]
    InvalidTokenId {},
}
