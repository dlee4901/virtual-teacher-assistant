import os, sys, json

# CLASS-RELATED TA IMPORTS
from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline
from flask_cors import CORS
from flask import Flask, request, send_from_directory, jsonify

# Flask setup
app = Flask(__name__)
CORS(app)

# CLASS-RELATED TA SETUP 
nlp = pipeline("question-answering", model = "..\ClassInfoTAPipeline")
context_file = open('classInfo.txt','r')
QA_Input = {'context': context_file.read()}

@app.route('/postClassMessage', methods=['POST'])
def postClassMessage():
    data = request.json

    # Class Message
    QA_Input['question'] = data['message']
    q = nlp(QA_Input)
    message = q['answer']
    probability = q['score']

    return jsonify({'message': str(message), 'probability': probability})

