import {HttpException, HttpStatus} from '@nestjs/common';

export const SafeHttp = (defaultText: string = 'Unknown Error', useText = false) => {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
        const originalMethod = descriptor.value;
        if (originalMethod.constructor && originalMethod.constructor.name === 'AsyncFunction') {
            descriptor.value = async function () {
                try {
                    return await originalMethod.apply(this, arguments);
                } catch (err) {
                    console.error(propertyKey, err.message);
                    if (err?.routine === '_bt_check_unique') {
                        throw new HttpException('Запись с таким названием уже существует', HttpStatus.BAD_REQUEST);
                    }
                    throw new HttpException(useText ? defaultText : (err.message || defaultText), HttpStatus.BAD_REQUEST);
                }
            };
        } else {
            descriptor.value = function () {
                try {
                    return originalMethod.apply(this, arguments);
                } catch (err) {
                    console.error(propertyKey, err.message);
                    if (err?.routine === '_bt_check_unique') {
                        throw new HttpException('Запись с таким названием уже существует', HttpStatus.BAD_REQUEST);
                    }
                    throw new HttpException(useText ? defaultText : (err.message || defaultText), HttpStatus.BAD_REQUEST);
                }
            };
        }
        return descriptor;
    };
};
export const SafeApi = (isThrowError = false) => {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
        const originalMethod = descriptor.value;
        if (originalMethod.constructor && originalMethod.constructor.name === 'AsyncFunction') {
            descriptor.value = async function () {
                try {
                    return await originalMethod.apply(this, arguments);
                } catch (err) {
                    console.error(propertyKey, `${err.message}: ${err.response?.data?.message}`);
                    if (isThrowError) throw new Error(err.message);
                }
            };
        } else {
            descriptor.value = function () {
                try {
                    return originalMethod.apply(this, arguments);
                } catch (err) {
                    console.error(propertyKey, `${err.message}: ${err.response?.data?.message}`);
                    if (isThrowError) throw new Error(err.message);
                }
            };
        }
        return descriptor;
    };
};
export const SafeLog = () => {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
        const originalMethod = descriptor.value;
        if (originalMethod.constructor && originalMethod.constructor.name === 'AsyncFunction') {
            descriptor.value = async function () {
                try {
                    return await originalMethod.apply(this, arguments);
                } catch (err) {
                    console.error(propertyKey, err.message);
                }
            };
        } else {
            descriptor.value = function () {
                try {
                    return originalMethod.apply(this, arguments);
                } catch (err) {
                    console.error(propertyKey, err.message);
                }
            };
        }
        return descriptor;
    };
};
export const Safe = () => {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
        const originalMethod = descriptor.value;
        if (originalMethod.constructor && originalMethod.constructor.name === 'AsyncFunction') {
            descriptor.value = async function () {
                try {
                    return await originalMethod.apply(this, arguments);
                } catch (err) {
                }
            };
        } else {
            descriptor.value = function () {
                try {
                    return originalMethod.apply(this, arguments);
                } catch (err) {
                }
            };
        }
        return descriptor;
    };
};
