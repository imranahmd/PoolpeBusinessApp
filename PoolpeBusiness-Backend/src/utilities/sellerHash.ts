import { Seller } from "../yesbankdto/Seller";
import { AppDataSource } from "../db/data-source"
import express, { Request, Response } from 'express';
import * as CryptoJS from 'crypto-js';  


class SellerHash {

// Utility functions object

    static tools = {
        assign(target: any, ...args: any[]) {
            Object.keys(target).forEach(key => {
                for (let i = 0; i < args.length; i++) {
                    (this.isInvalid(args[i][key], false, true) || args[i][key] === "") &&
                    (target[key] = args[i][key]);
                }
            });
            return target;
      
        },
        //isInvalid(str: any, ret: any, ret2?: any)
        isInvalid(str, ret, ret2) {
            // if (str === null || str === undefined || Number.isNaN(str) || str === 'undefined' ||
            //     str === 'null' || str === '' || str === 'NaN')
            if (str === null || str === undefined || Number.isNaN(str) || str === 'undefined' ||
                str === 'null' || str === '' || str === 'NaN')
                return ret;
            if (ret2 != undefined)
                return ret2;
            return str;
        },
        // cleanErrorVal(obj: any)
        cleanErrorVal(obj) {
            for (const key in obj) {
                if (this.isInvalid(obj[key], true, false)) {
                    delete obj[key];
                }
            }
            return obj;
        }
    };

    // Hashing function
    // static sellerHash = function hashEncrypt(data: any, sortKeys: string[], keys: string[])
    static sellerHash = function hashEncrypt(data, sortKeys, keys) {
        // Combine keys and sort them
        keys = [...keys, ...sortKeys.sort()];

        // Create a new object with default values
        // let newObj: any = {};
        let newObj = {};
        
        for (let i = 0; i < keys.length; i++) {
            newObj[keys[i]] = "";
        }

        // Assign values from data to newObj
        // let d: any = SellerHash.tools.assign(newObj, data);
        let d = SellerHash.tools.assign(newObj, data);

        // Clean any error values
        d = SellerHash.tools.cleanErrorVal(d);

        // Concatenate values into a string
        let str = "";
        // for (const key in d)
        for (let key in d)
        {
            str += d[key] + "|";
        }
        // Remove the last "|" character
        str = str.slice(0, -1);

        // Log data, keys, and str
        console.log(data, keys, str);

        // Generate hash using CryptoJS and return it
        return CryptoJS.SHA512(str).toString().toLocaleUpperCase();
    }

}

 export default SellerHash;


   

   
















