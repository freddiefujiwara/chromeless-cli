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
        this.stdin = '';
    }
    /**
    * Get a line from fd
    *
    * @return {string} one line string
    */
    readLine() {
        if (this.stdin.length === 0) {
            const BUFSIZE = 256;
            let totalBuf = Buffer.alloc(BUFSIZE, '', 'utf8');
            let totalBytesRead = 0;
            for (;;) {
                try {
                    let buf = Buffer.alloc(BUFSIZE, '', 'utf8');
                    let bytesRead = fs.readSync(this.fd, buf, 0, BUFSIZE, null);
                    if (bytesRead === 0) {
                        break;
                    }
                    // Copy the new bytes to totalBuf.
                    let tmpBuf = Buffer
                        .alloc(totalBytesRead + bytesRead, '', 'utf8');
                    totalBuf.copy(tmpBuf, 0, 0, totalBytesRead);
                    buf.copy(tmpBuf, totalBytesRead, 0, bytesRead);
                    totalBuf = tmpBuf;
                    totalBytesRead += bytesRead;
                    if (buf.includes('\n')) {
                        break;
                    }
                } catch (e) {
                    if (e.code === 'EOF') {
                         break;
                    }
                }
            }
            this.stdin = totalBuf.toString('utf8');
        }
        let newline = this.stdin.search('\n') + 1;
        let line = this.stdin.slice(0, newline);
        // Flush
        this.stdin = this.stdin.slice(newline);
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
        this.cl[args.shift()](...args)
            .then((result) =>{
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
