import { parse, Type } from 'protobufjs';
import { SetDecoderInfoParameters } from '../../api/parameters/deviceParameters';

// Move to component
export const validateDecoderInfo = async (parameters: SetDecoderInfoParameters): Promise<Type> => {
    let prototype: Type;
    const fr = new FileReader();
    if (parameters.decoderFile && parameters.decoderType) {
        return new Promise((resolve, reject) => {
            fr.onload = e => {
                const fileContents = e.target.result;
                if (fileContents instanceof ArrayBuffer) {
                    return; // shouldn't happen because fr is only reading as text
                }
                try {
                    prototype = parse(fileContents).root.lookupType(parameters.decoderType);
                    resolve(prototype);
                } catch (e) {
                    reject(new Error(e.message));
                }
            };
            fr.readAsText(parameters.decoderFile);
        });
        // fr.onload = e => {
        //     const fileContents = e.target.result;
        //     if (fileContents instanceof ArrayBuffer) {
        //         return; // shouldn't happen because fr is only reading as text
        //     }
        //     try {
        //         prototype = parse(fileContents).root.lookupType(parameters.decoderType);
        //     } catch (e) {
        //         return e.message;
        //     }
        // };
        // fr.readAsText(parameters.decoderFile);
    }
};
