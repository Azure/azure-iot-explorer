import { parse, Type } from 'protobufjs';
import { SetDecoderInfoParameters } from '../../api/parameters/deviceParameters';

export const setDecoderInfo = async (parameters: SetDecoderInfoParameters): Promise<Type> => {
    let prototype: Type;
    const fr = new FileReader();
    return new Promise((resolve, reject) => {
        if (parameters.decodeType === 'Protobuf') {
            fr.onload = e => {
                const fileContents = e.target.result;
                if (fileContents instanceof ArrayBuffer) {
                    return; // shouldn't happen because fr is only reading as text
                }
                try {
                    prototype = parse(fileContents).root.lookupType(parameters.decoderPrototype);
                    resolve(prototype);
                } catch (e) {
                    reject(new Error(e.message));
                }
            };
            fr.readAsText(parameters.decoderFile);
        } else {
            resolve(null);
        }
    });
};
