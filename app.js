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
  }
  async call() {
    let connection = new Telnet()

    // these parameters are just examples and most probably won't work for your use-case.
    console.log(this.name, this.ip, this.password)
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
      console.log(error);
    }


    report += `\t${this.name}\t${this.ip}`;
    let res = '';
    let i = 0;
    let regexInCall = /inacall online/;

    res = await connection.send('dial manual 1024 888888.1120324757@t.plcm.vc h323');
    console.log(res)
    report += `\t${res.replace(/\r?\n|\r/g, "")}`;

    setTimeout(async function () {
      let res = await connection.send('status');

      console.log(res);
      if (regexInCall.test(res)) {
        report += `\tinacall online`;
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
    console.log(this.name, this.ip, this.password)
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
      console.log(`Connected to the GS Endpoint IP: ${this.ip} Name: ${this.name} - Disconenct Method`)
    } catch (error) {
      console.log(error);
    }

    return await connection.send('hangup all');
    await connection.end();
  }
}

// fs.readFile('/mnt/d/Repo/GS-ReportStatus-Telnet/GroupSeriesList.txt', 'utf8' , (err, data) => {

//   if (err) {
//     console.error(err)
//     return
//   }
//   arr.push(data);
//   console.log(data.split('\n'))
//   arr = data.split('\n').map( (e) => {
//     return e.split(',');
//   })
//   console.log(arr)
// })

console.log("GSDialer initialized");

let newCall = new Call("GS-500", "192.168.1.133", "5712")
console.log(newCall)
newCall.call();

setTimeout(async function () {
  newCall.disconnect();
}, 15000);

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



