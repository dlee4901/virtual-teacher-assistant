import os, sys, json
from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline
from flask_cors import CORS
from flask import Flask, request, send_from_directory, jsonify

app = Flask(__name__)
CORS(app)

nlp = pipeline("question-answering", model = ".\ClassInfoTAPipeline")
context_file = open('classInfo.txt','r')
QA_Input = {'context': context_file.read()}

@app.route('/postMessage', methods=['POST'])
def postMessage():
    data = request.json

    QA_Input['question'] = data['message']
    q = nlp(QA_Input)
    message = q['answer'] if (q['score'] > 0.3) else 'I am not too confident on that question, please contact the TA for this class if you need more information'

    return jsonify({'message': message})
