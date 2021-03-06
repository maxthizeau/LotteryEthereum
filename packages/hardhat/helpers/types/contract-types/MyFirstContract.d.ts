/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface MyFirstContractInterface extends ethers.utils.Interface {
  functions: {
    "balance()": FunctionFragment;
    "purpose()": FunctionFragment;
    "setPurpose(string)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "balance", values?: undefined): string;
  encodeFunctionData(functionFragment: "purpose", values?: undefined): string;
  encodeFunctionData(functionFragment: "setPurpose", values: [string]): string;

  decodeFunctionResult(functionFragment: "balance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "purpose", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setPurpose", data: BytesLike): Result;

  events: {
    "SetPurpose(address,string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "SetPurpose"): EventFragment;
}

export type SetPurposeEvent = TypedEvent<
  [string, string] & { sender: string; purpose: string }
>;

export class MyFirstContract extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: MyFirstContractInterface;

  functions: {
    balance(overrides?: CallOverrides): Promise<[BigNumber]>;

    purpose(overrides?: CallOverrides): Promise<[string]>;

    setPurpose(
      _newPurpose: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  balance(overrides?: CallOverrides): Promise<BigNumber>;

  purpose(overrides?: CallOverrides): Promise<string>;

  setPurpose(
    _newPurpose: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    balance(overrides?: CallOverrides): Promise<BigNumber>;

    purpose(overrides?: CallOverrides): Promise<string>;

    setPurpose(_newPurpose: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "SetPurpose(address,string)"(
      sender?: null,
      purpose?: null
    ): TypedEventFilter<[string, string], { sender: string; purpose: string }>;

    SetPurpose(
      sender?: null,
      purpose?: null
    ): TypedEventFilter<[string, string], { sender: string; purpose: string }>;
  };

  estimateGas: {
    balance(overrides?: CallOverrides): Promise<BigNumber>;

    purpose(overrides?: CallOverrides): Promise<BigNumber>;

    setPurpose(
      _newPurpose: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    purpose(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setPurpose(
      _newPurpose: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
