import {Chromeless} from 'chromeless';
import fs from 'fs';
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
        let buffer = new Buffer(1);
        let line = '';
        while (true) { // Loop as long as stdin input is available.
            let bytesRead = 0;
            try {
                bytesRead = fs.readSync(this.fd, buffer, 0, 1);
                if (0 === bytesRead) {
                    break;
                }
                line += buffer.toString('utf8', 0, 1);
                if ( 0x0a === buffer[0] ) { // EOL 'n'
                    break;
                }
            } catch (e) {
                // reached to EOF
                if ('EOF' === e.code) {
                    break;
                }
                // ignore other exceptions ...
                // but it's not a good idea
                // welcome to other solutions
            }
        }
        return line;
    }

    /**
    * run commands
    */
    run() {
        if ( typeof this.cl === 'undefined') {
            this.cl = new Chromeless();
        }
        const line = this.readLine();
        if ( '' === line ) {
            this.cl.end().then(() => {
                fs.closeSync(this.fd);
            }).catch(console.error.bind(console));
            return;
        }
        const args = this.parseLine(line);
        this.cl[args.shift()](...args).then((result) =>{
            if (typeof result === 'string') {
                console.log(result);
            }
            this.run(); // loop
        }).catch((e) => {
            console.error(e);
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
