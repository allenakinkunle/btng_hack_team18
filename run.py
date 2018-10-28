from flask import Flask, request, session
from twilio.twiml.messaging_response import MessagingResponse
from helpers import *

app = Flask(__name__)

@app.route("/sms", methods=["GET", "POST"])
def sms_user_flow():

    if session.get("stage") == "complete":
        session.clear()

    # There are multiple stages of the flow
    flow_stage = session.get("stage", "init")

    print(flow_stage)

    # Get message
    message = str(request.form.getlist('Body')[0]).lower().strip()
    resp = MessagingResponse()
    
    # User initiates conversation
    if flow_stage == "init":
        if message == "report":
            response = 'Thank you for contacting us. Please provide', \
             'your polling unit code so we know where you are sending your', \
              'report from'
            response = ' '.join(response)
            resp.message(response)
            
            # Move to the next stage
            session["stage"] = "ask_polling_boot"
    
    # User supplies polling unit
    elif flow_stage == "ask_polling_boot":
        is_polling_unit = is_polling_boot(message)
        if is_polling_unit:
            response = 'What do you want', \
                'to report? Text 1 is you voted without any problem', \
                'Text 2 if you are concerned about violence', \
                'Text 3 if your couldn\'t vote', \
                'Text 4, if you have a different issue not listed.'
            response = ' '.join(response)
            resp.message(response)

            # Save polling unit code
            session["polling_unit"] = message
            session["stage"] =  "type_report"
        else:
            response = 'Thanks for texting us. We didn\'t understand your last message', \
             'Please provide us with the code above your picture on your Voter\'s Card. (Ex: 08-06-05-012)'
            response = ' '.join(response)
            resp.message(response)

    # User selects type of report
    elif flow_stage == "type_report":

        if message == '1':
            response = 'Thank you for reporting issues at your polling place', \
                'and helping improve elections across Nigeria.'
            response = ' '.join(response)

            resp.message(response)

            # Save result to firebase
            save_to_db(session["polling_unit"], "I voted successfully", "safe")

            session["stage"] = "complete"
            
        elif message == '2':
            response = 'You are reporting a threat of violence. Can you', \
                'provide any more details?'
            response = ' '.join(response)
            resp.message(response)

            session["stage"] = "more_details"
    
    # User provides more details
    elif flow_stage == "more_details":
        
        # Save the details to the DB
        save_to_db(session["polling_unit"], message, "violence")

        response = 'Thank you for reporting issues at your polling place', \
                'and helping improve elections across Nigeria. We will pass', \
                'your information to the authorities'
        response = ' '.join(response)

        resp.message(response)

        session["stage"] = "complete"

    return str(resp)

if __name__ == "__main__":
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(debug=True)