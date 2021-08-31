const Telnet = require('telnet-client')

let regexInCall = /inacall online/;

class CallController {
    constructor(name, ip, password) {
        this.name = name;
        this.ip = ip;
        this.password = password;
    }
    async call() {
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
            console.log(error);
            // handle the throw (timeout)
        }

        console.log(`Connected to the GS Endpoint IP: ${this.ip} Name: ${this.name}`)
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
                return `GS Endpoint IP: ${this.ip} Name: ${this.name} is connected`
            } else {
                report += `\tinacall offline\n`;
                return `GS Endpoint IP: ${this.ip} Name: ${this.name} did not connect, please check the logs`
            }

        }, 8000);


    }
}


module.exports = new CallController();