import {Chromeless} from 'chromeless';
import readline from 'readline';
/**  
 ** main class of ChromelessCLI
 */
export default class ChromelessCLI {
/**
* @constructor
* @param {Readable stream} stream stdio or file
*/
    constructor(stream) {
        this.stream = stream;
    }

    /**
    * run commands
    */
    async run() {
        const cl = new Chromeless();
        const iface = readline.createInterface(this.stream, process.stdout);
        iface.on('line', async line => {
            const args = this.parseLine(line);
            const result = await cl[args.shift()].apply(cl,args)
            if(typeof result === 'undefined'){
                return;
            }
            console.log(result);
        });
        iface.on('close', async () => {
            await cl.end();
        });
    }

    /**
    * parseLine parse  like a shell command line
    * @param {string} line command line
    * @return {array} parsed
    */
    parseLine(line) {
        if (typeof line !== 'string') {
            return [];
        }
        return line.match(/"[^"]+"|'[^']+'|\S+/g)
            .map((arg) => {
                if (1 < arg.length
                    && arg.match(/^["'].*["']$/)) {
                    const unquoted = arg.slice(1, -1);
                    return unquoted.match(/^{.*}$/) ?
                        JSON.parse(unquoted) :
                        unquoted;
                }
                return arg;
            });
    }
}
