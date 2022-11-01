import os, sys
from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline

from flask import Flask, request, send_from_directory

app = Flask(__name__)

nlp = pipeline("question-answering", model = "..\ClassInfoTAPipeline")
context_file = open('classInfo.txt','r')

def AnswerQuestion(question):
    QA_Input = {'question': question,
            'context': context_file.read()}
    
    q = nlp(QA_Input)
    if (q['score'] > 0.3): return 'Answer: ' + q['answer']
    else: return 'Answer: I am not too confident on that question, please contact the TA for this class if you need more information'

@app.route('/postMessage', methods=['POST'])
def login():
    data = request.json
    message = AnswerQuestion(data['message'])
    return json.dumps({'message': message})

