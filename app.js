'use strict'


const fs = require('fs');
let calls = [];
var report = "";

//Call Controller
const Telnet = require('telnet-client')

let regexInCall = /inacall online/;

class Call {
  constructor(name, ip, password) {
    this.name = name;
    this.ip = ip;
    this.password = password;
    this.state = "disconnected";
  }
  async call() {
    console.log("Chamando")
    let connection = new Telnet()

    // these parameters are just examples and most probably won't work for your use-case.
    let params = {
      host: this.ip,
      port: 24,
      password: `${this.password}\r\n`,
      passwordPrompt: 'Password: ',
      shellPrompt: '-> ', // or negotiationMandatory: false
      timeout: 50000
    }
    console.log(params)
    try {
      await connection.connect(params)
      console.log(`Connected to the GS Endpoint IP: ${this.ip} Name: ${this.name}`)
    } catch (error) {
      console.log(error)
      return error
    }


    report += `\t${this.name}\t${this.ip}`;
    let res = '';
    let i = 0;
    let regexInCall = /inacall online/;

    res = await connection.send('dial manual 1024 888888.1120324757@t.plcm.vc h323');
    report += `\t${res.replace(/\r?\n|\r/g, "")}`;

    setTimeout(async function () {
      let res = await connection.send('status');

      if (regexInCall.test(res)) {
        report += `\tinacall online`;
        this.state = "connected";
        await connection.end();
        return `GS Endpoint IP: ${this.ip} Name: ${this.name} is connected`
        await connection.end();
      } else {
        report += `\tinacall offline\n`;
        await connection.end();
        return `GS Endpoint IP: ${this.ip} Name: ${this.name} did not connect, please check the logs`
      }

    }, 8000);
  }
  async disconnect() {
    let connection = new Telnet()

    // these parameters are just examples and most probably won't work for your use-case.
    let params = {
      host: this.ip,
      port: 24,
      password: `${this.password}\r\n`,
      passwordPrompt: 'Password: ',
      shellPrompt: '-> ', // or negotiationMandatory: false
      timeout: 50000
    }
    try {
      await connection.connect(params)
    } catch (error) {
      return error;
    }
    if (this.state = "connected") this.state = "disconnected"
    let res = await connection.send('hangup all');
    console.log(`Connected to the GS Endpoint IP: ${this.ip} Name: ${this.name} - Call is disconnected`)
    await connection.end();
    return res;

  }
}

console.log("GSDialer initialized");

console.log("Reading CSV file")
const { promises: { readFile } } = require("fs");

readFile("/mnt/d/Repo/GS-ReportStatus-Telnet/GroupSeriesList.txt").then(fileBuffer => {
  console.log(fileBuffer.toString());

  // Split data into lines and separate headers from actual data
  // using Array spread operator
  const [headerLine, ...lines] = fileBuffer.toString().split('\r\n');

  // Split headers line into an array
  // `valueSeparator` may come from some kind of argument
  // You may want to transform header strings into something more
  // usable, like `camelCase` or `lowercase-space-to-dash`
  const valueSeparator = ',';
  const headers = headerLine.split(valueSeparator);
  // Create objects from parsing lines
  // There will be as much objects as lines
  const objects = lines
    .map((line, index) =>
      line
        // Split line with value separators
        .split(valueSeparator)

        // Reduce values array into an object like: { [header]: value }
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
        .reduce(

          // Reducer callback 
          (object, value, index) => ({
            ...object,
            [headers[index]]: value,
          }),

          // Initial value (empty JS object)
          {}
        )
    );
  console.log(objects)
  let dialer = 3;
  for (let i=0; i<dialer; i++ ) {
    console.log(objects[i])
    let newCall = new Call(objects[i].endpoint_name, objects[i].ip_address, objects[i].password)
    console.log(newCall)
    let resCall = newCall.call();
    console.log("Retorno res",resCall)

    console.log(resCall.toString().indexOf('Error:'))
    if(resCall.toString().indexOf('Error:') === -1) {
      setTimeout(async function () {
        console.log("entrou setTimeout")
        let resDisconnect = newCall.disconnect();
        console.log(resDisconnect)
      }, 15000);
    }
    console.log("Call number ",i)
  }
  
}).catch(error => {
  console.error(error.message);
  process.exit(1);
});









// async function call(data) {
//   let connection = new Telnet()

//   // these parameters are just examples and most probably won't work for your use-case.
//   let params = {
//     host: data[1],
//     port: 24,
//     password: `${data[3]}\r\n`,
//     passwordPrompt: 'Password: ',
//     shellPrompt: '-> ', // or negotiationMandatory: false
//     timeout: 50000
//   }

//   try {
//     await connection.connect(params)
//   } catch(error) {
//     console.log(error);
//     // handle the throw (timeout)
//   }

//   console.log("GS Telnet Connected")
//   report += `\t${data[0]}\t${data[1]}`;
//   let res= '';
//   let i=0;
//   let regexInCall = /inacall online/;

//   res = await connection.send('dial manual 1024 888888.1120324757@t.plcm.vc h323');
//   console.log(res)
//   report += `\t${res.replace(/\r?\n|\r/g, "")}`;



//  setTimeout(async function(){
//         let res = await connection.send('status');

//         console.log(res);
//         if(regexInCall.test(res)){
//           report += `\tinacall online`;
//           res = await connection.send('hangup all');
//           report += `\t${res}\n`;
//           console.log("Disconnecting")
//           await connection.end();
//         } else {
//           report += `\tinacall offline\n`;
//           await connection.end();
//         }

//         fs.appendFile('/mnt/d/Repo/GS-ReportStatus-Telnet/results.txt', report, err => {
//           if (err) {
//             console.error(err)
//             return
//           }
//           console.log("Report updated successfully");
//           report = "";
//         })

//         }, 8000);



// }
// let i=0;
// setInterval(function(){ 
//     report += `Calling ${new Date()}`;
//     console.log("Calling",new Date());
//     console.log(arr[1])
//     if(!inCall){
//       call(arr[1]);
//     } else {
//       console.log("The ongoing cal must terminate first");
//     } 

// }, 20000);



  // -> dial manual 1024 888888.1120324757@t.plcm.vc h323
  // dialing manual

  // ->
  // -> status
  // inacall online
  // autoanswerp2p offline
  // remotecontrol online
  // microphones online
  // visualboard online
  // globaldirectory offline
  // ipnetwork online
  // gatekeeper offline
  // sipserver offline
  // logthreshold offline
  // meetingpassword offline
  // rpms offline
  // modularroom offline
  // status end

  // -> getcallstate
  // cs: call[5] speed[1024] dialstr[888888.1120324757@t.plcm.vc] state[connected]
  // cs: call[1] inactive
  // cs: call[2] inactive

  // ->
  // -> hangup all
  // hanging up all

  // -> status
  // inacall offline
  // autoanswerp2p offline
  // remotecontrol online
  // microphones online
  // visualboard online
  // globaldirectory offline
  // ipnetwork online
  // gatekeeper offline
  // sipserver offline
  // logthreshold offline
  // meetingpassword offline
  // rpms offline
  // modularroom offline
  // status end

  // ->
  // ->
  // -> getcallstate
  // cs: call[0] inactive
  // cs: call[1] inactive
  // cs: call[2] inactive

  // ->
  // ->



// function readFile(arr) {

//   fs.readFile('/mnt/d/Repo/GS-ReportStatus-Telnet/GroupSeriesList.txt', 'utf8', (err, data) => {

//     if (err) {
//       console.error(err)
//       return
//     }
//     arr.push(data);
//     console.log(data.split('\n'))
//     arr = data.split('\n').map((e) => {
//       return e.split(',');
//     })
//     console.log(arr)
//   })

//   return arr;
// }

