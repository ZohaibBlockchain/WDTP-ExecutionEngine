import { getInstrument, checkAddress, nonLeverageTradeManager, LeverageTradeManager, getInstrumentAddress } from "../web3";



import { checkLeverageInstruments } from "../../helperFx"

import {
  UserModel,
  TokenModel,
  TradeModel,
  defaultIconModel,
} from "../../schemas";
import { ethers } from "ethers";
import e from "express";



//---------DBFunction----------
export async function userExits(wallet) {
  return await UserModel.countDocuments({ userWallet: wallet });
}



export async function getUserInstrumentSettings(wallet, symbol) {
  return await UserModel.findOne({ userWallet: wallet });
}



export async function AddNewUser(userData) {
  const NewUser = new UserModel({
    userWallet: userData.wallet,
    Instruments: userData.instruments,
  });
  return await NewUser.save();
}



export async function UpdateUserData(newInstruments, id) {
  let result = await UserModel.findByIdAndUpdate(id, { Instruments: newInstruments });
  return result;
}



export async function UpdateUserWallet(userData) {
  let result = await UserModel.findOneAndUpdate({ userUId: userData._id }, { $set: { userWallet: userData.address } });
  return result;
}







export async function registerTrade(info) {

  console.log(info);
  try {
    let count = await TradeModel.countDocuments({ orderID: info.orderID });
    let execCount = await TradeModel.countDocuments({ execID: info.execID });
    console.log(count,execCount);

    if (count == 0 && execCount == 0) {
      const newTrade = new TradeModel({
        walletAddress: info.walletAddress,
        tokenAmount: info.tokenAmount,
        tokenSymbol: info.tokenSymbol,
        instrumentType: info.instrumentType,
        side: info.side,
        contractMultiplier: info.ContractMultiplier,
        instrumentName: info.instrumentName,
        transactionHash: "0x00",
        orderID: info.orderID,
        execID: info.ExecID,
      });
      let x = await newTrade.save();
      return { result: 'Unique', value: x };
    }
    else {
      return { result: 'Already exits', value: 'x' };
    }
  } catch (error) {
    return { result: 'error', value: 'x' };
  }
}









export async function ExeTrade() {
  try {
    let count = await TradeModel.countDocuments({ transactionHash: "0x00" });
    if (count > 0) {
      let trade = await TradeModel.findOne({ transactionHash: "0x00" });
      console.log('trade--->>>',trade);
      let addresses = await getInstrument(trade);
      console.log(addresses);
      let pending = await TradeModel.updateOne({ _id: trade._id }, { transactionHash: 'Pending' });
      if (pending)//Pending write sucessfully
      {
        let res = await LeverageTradeManager(trade, addresses);
        console.log(res);
        if(res.res == 'Failed')
        {
          return await TradeModel.updateOne({ _id: trade._id }, { transactionHash: '0x00' });
          console.log('XXXXXX');
        }else{
          return await TradeModel.updateOne({ _id: trade._id }, { transactionHash: res.tx});
        }
      } else {
        throw 'DB Issue occur while writing';
      }
    } else {
      return 'No Transaction right Now!';
    }
  }
  catch (error) {

  }
}




export async function tokenDetail(inf) {
  let userTokenData = [];
  let count = await UserModel.countDocuments({ userWallet: inf.walletAddress });
  let user = await UserModel.findOne({ userWallet: inf.walletAddress })
  if (checkLeverageInstruments(inf.symbol))//Leverage Instrument
  {
    let getTokenValue = getInstrumentValue(user, inf.symbol);

  } else {

  }
}



function getInstrumentValue(user, symbol) {
  let value = 1;
  user.Instruments.forEach(element => {
    if (element.name === symbol);
    value = element.value;
    return value;
  });
  return value;
}

//---------DBFunction----------



