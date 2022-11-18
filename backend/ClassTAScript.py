import os, sys, json

# CLASS-RELATED TA IMPORTS
from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline
from flask_cors import CORS
from flask import Flask, request, send_from_directory, jsonify

from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

# Flask setup
app = Flask(__name__)
CORS(app)

# CLASS-RELATED TA SETUP 
nlp = pipeline("question-answering", model = ".\ClassInfoTAPipeline")
context_file = open('classInfo.txt','r')
QA_Input = {'context': context_file.read()}

# MATERIAL-RELATED TA SETUP
chatbot = ChatBot("VirtualTA")
trainer = ListTrainer(chatbot)

with open("CleanedWikis/chatbotdb.txt") as data:
    for line in data:
        if line == "\n": continue
        qa = line.split("::")
        trainer.train(qa)

@app.route('/postClassMessage', methods=['POST'])
def postClassMessage():
    data = request.json

    # Class Message
    QA_Input['question'] = data['message']
    q = nlp(QA_Input)
    message = q['answer']

    # Material message
    if q['score'] < 0.3:
        message = chatbot.get_response(data['message'])

    return jsonify({'message': str(message)})

