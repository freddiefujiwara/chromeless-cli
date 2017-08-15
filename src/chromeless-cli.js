import {Chromeless} from 'chromeless';
import fs from 'fs';
import os from 'os';
/**  
 ** main class of ChromelessCLI
 */
export default class ChromelessCLI {
    /**
    * @constructor
    * @param {fd} fd stdin or file
    */
    constructor(fd) {
        this.fd = fd;
        this.cl = undefined;
    }
    /**
    * Get a line from fd
    *
    * @return {string} one line string
    */
    readLine() {
        let length = fs.fstatSync(this.fd).size;
        let buffer = new Buffer(length);
        let bytesRead = fs.readSync(this.fd, buffer, 0, length, 0);
        for (let i = 0; i < bytesRead; i++) {
            // EOL '\n'
            if ( 0x0a === buffer[i] ) {
                return buffer.toString('utf8', 0,
                                       os.EOL.length > 1 ? i - 1 : i);
            }
        }
    }

    /**
    * run commands
    */
    run() {
        if ( typeof this.cl === 'undefined') {
            this.cl = new Chromeless();
        }
        const args = this.parseLine(this.readLine());
        this.cl[args.shift()](...args).then((result) =>{
            if (typeof result === 'string') {
                console.log(result);
            }
            this.run();
        }).catch((e) => {
            this.cl.end().then().catch(console.error.bind(console));
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
