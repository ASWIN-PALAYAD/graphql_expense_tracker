import cron from 'cron';

import https from 'http';

const URL = "https://graphql-expense-tracker.onrender.com"

const job = new cron.sendAt('*/14 * * * *',function(){
    https.get(URL,(res)=> {
        if(res.statusCode === 200){
            console.log("GET request sent successfully");
        }else{
            console.log("GET request failed",res.statusCode);
        }
    }).on('error',(e)=> {
        console.log("Error while sending request",e);
    })
})

export default job;