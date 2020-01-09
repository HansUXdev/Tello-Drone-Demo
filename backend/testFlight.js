const dgram = require('dgram');

const wait = (time = 0) => new Promise(resolve => setTimeout(resolve, time));

const sendError = (err) => { if (err) console.log('ERROR: ' + err)} ;

/**
* @description: Command Delays
*/
const commandDelays = {
    command: 500,
    takeoff: 5000,
    land: 5000,
    up: 7000,
    down: 7000,
    left: 5000,
    go: 7000,
    right: 5000,
    forward: 5000,
    back: 5000,
    cw: 5000,
    ccw: 5000,
    flip: 3000,
    speed: 3000,
    'battery?': 500,
    'speed?': 500,
    'time?': 500,
};

const PORT = 8889;
const HOST = '192.168.10.1';
const drone = dgram.createSocket('udp4');
drone.bind(PORT)



/**
 * @description: Drone State
 * @link : https://nodejs.org/api/dgram.html#dgram_event_message
 */

drone.on('message', message => console.log(`status : ${message}`) );


/**
 * Commands
 */
const commands = ['command', 'battery?','takeoff', 'land','emergency'];
const totalCommands = commands.length;
let currentCommand = 0;

/**
 * Hello Drone !
*/
async function initDrone() {
  const command = commands[currentCommand];

  // determines the  of the delay for the command
  const delay = commandDelays[command]; 
  console.log(`
  running command: ${command}
  delay time: ${delay}
  `)

  // sends the command
  drone.send(command, 0, command.length, PORT,HOST, sendError);
  
  /**
  * waits for the promise to be resolved 
  * after waiting the required amount of time
  */
  await wait(delay);

  /**
   * increments the current command
   * if the currentCommand is less than totalCommands
   * run the function again, recursively
   */
  currentCommand += 1; 
  if (currentCommand < totalCommands) return initDrone();
  console.log('done!');
  
}

initDrone();