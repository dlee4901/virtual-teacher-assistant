import os, sys, json

# CLASS-RELATED TA IMPORTS
from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline
from flask_cors import CORS
from flask import Flask, request, send_from_directory, jsonify

# MATERIAL-RELATED TA IMPORTS
from haystack.document_stores import InMemoryDocumentStore
from haystack.pipelines import ExtractiveQAPipeline
from haystack.utils import print_answers, fetch_archive_from_http, convert_files_to_docs, clean_wiki_text, launch_es
from haystack.nodes import TfidfRetriever, FARMReader

app = Flask(__name__)
CORS(app)

# CLASS-RELATED TA SETUP 
nlp = pipeline("question-answering", model = ".\ClassInfoTAPipeline")
context_file = open('classInfo.txt','r')
QA_Input = {'context': context_file.read()}

# MATERIAL-RELATE TA SETUP
document_store = InMemoryDocumentStore()
docs = convert_files_to_docs(dir_path="CleanedWikis", clean_func=clean_wiki_text, split_paragraphs=True)
document_store.write_documents(docs)
retriever = TfidfRetriever(document_store=document_store)
reader = FARMReader(model_name_or_path="deepset/roberta-base-squad2", use_gpu=True)
pipe = ExtractiveQAPipeline(reader, retriever)

@app.route('/postClassMessage', methods=['POST'])
def postClassMessage():
    data = request.json

    QA_Input['question'] = data['message']
    q = nlp(QA_Input)
    message = q['answer'] if (q['score'] > 0.3) else 'I am not too confident on that question, please contact the TA for this class if you need more information'

    return jsonify({'message': message})

@app.route('/postMaterialMessage', methods=['POST'])
def postMaterialMessage():
    data = request.json
    prediction = pipe.run(query=data['message'], params={"Retriever": {"top_k": 10}, "Reader": {"top_k": 5}})
    message = prediction['answers'][0].answer
    return jsonify({'message': message})