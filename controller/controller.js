const Telnet = require('telnet-client')

let regexInCall = /inacall online/;



async function call(data, report) {
    let connection = new Telnet()
  
    let params = {
      host: data[1],
      port: 24,
      password: `${data[3]}\r\n`,
      passwordPrompt: 'Password: ',
      shellPrompt: '-> ', // or negotiationMandatory: false
      timeout: 50000
    }
    
    try {
      await connection.connect(params)
    } catch(error) {
      console.log(error);
      // handle the throw (timeout)
    }
  
    console.log(`Group Series IP:${data[1]} - Telnet Connection Established`)
    report += `\t${data[0]}\t${data[1]}`;
    let res= '';


    
    res = await connection.send('dial manual 1024 888888.1120324757@t.plcm.vc h323');
    console.log(res)
    report += `\t${res.replace(/\r?\n|\r/g, "")}`;
   
    if(regexInCall.test(res)){
        report += `\tinacall online`;
        await connection.end();
      } else {
        report += `\tinacall offline\n`;
        await connection.end();
      }
}

async function Disconnect(data, report) {
    let connection = new Telnet()
  
    let params = {
      host: data[1],
      port: 24,
      password: `${data[3]}\r\n`,
      passwordPrompt: 'Password: ',
      shellPrompt: '-> ', // or negotiationMandatory: false
      timeout: 50000
    }
    
    try {
      await connection.connect(params)
    } catch(error) {
      console.log(error);
      // handle the throw (timeout)
    }
  
    console.log(`Group Series IP:${data[1]} - Telnet Connection Established`)
    report += `\t${data[0]}\t${data[1]}`;

    regexInCall = /inacall online/;
    
    if(regexInCall.test(res)){
        res = await connection.send('hangup all');
        report += `\t${res}\n`;
        console.log("Disconnecting")
        await connection.end();
        WriteReport(report);
      } else {
        report += `\tNot Connected\n`;
        await connection.end();
        WriteReport(report);
      }
}


function WriteReport (report){

    fs.appendFile('/mnt/d/Repo/GS-ReportStatus/results.txt', report, err => {
        if (err) {
          console.error(err)
          return
        }
        console.log("Report updated successfully");
        report = "";
      })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = Controller;