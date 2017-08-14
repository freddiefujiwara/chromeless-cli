import {Chromeless} from 'chromeless';
/**  
** main class of ChromelessCLI
*/
export default class ChromelessCLI {
  /**
   * @constructor
   */
  constructor() {
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

  /**
   * run commands
   */
  run() {
      try {
        const cl = new Chromeless();
        console.log(cl);
      } catch (e) {
          console.error(e);
      }
  }
}
