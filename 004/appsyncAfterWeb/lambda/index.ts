// import { Handler } from "aws-cdk-lib/aws-lambda"
interface AppSync {
    info: {
        fieldName: string
    }
    arguments: {
        msg: string
    }
}

exports.handler =  async(event: AppSync) => {
    if(event.info.fieldName === 'hello'){
        return "Hello world";
    }else if(event.info.fieldName === 'myMessage'){
        return `My Custom Message ${event.arguments.msg} `
    }
    else if(event.info.fieldName === 'addmyMessage'){
        return `My Custom Message ${event.arguments.msg} `
    }
    else{
        return "No Data FOund"
    }
    }
