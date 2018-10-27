from flask import Flask, request, session
from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)

@app.route("/sms", methods=["GET", "POST"])
def sms_user_flow():

    # There are multiple stages of the flow
    flow_stage = session.get("stage", "init")

    print(flow_stage)

    # Get message
    message = str(request.form.getlist('Body')[0]).lower().strip()
    resp = MessagingResponse()
    
    if flow_stage == "init":
        # Send message to the user
        if message == "report":
            resp.message('Thank you for contacting us. Please provide', \
             'your polling unit code so we know where you are sending your', \
              'report from')
            
            # Move to the next stage
            session["stage"] = "ask_polling_boot"
    
    elif flow_stage == "ask_polling_boot":
        if message == "24-16-14-020":
            resp.message('You are in Ilepuju. What do you want', \
            'to report? Reply with "1" for Violence, "2" for Peace')
        
    return str(resp)

if __name__ == "__main__": 
    app.run(debug=True)