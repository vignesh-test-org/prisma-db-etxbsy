import { ReturnType } from './core.interface';

export interface TestValueType {
    value1: number;
    value2: number;
}

export interface TestDataType {
    sum: number;
}

export interface TestDataType1 {
    product: number;
}

export interface TestReturnType extends ReturnType {
    data: TestDataType;
}

export interface Test1ReturnType extends ReturnType {
    data: TestDataType1;
}
