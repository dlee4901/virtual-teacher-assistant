import os, sys
from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline

nlp = pipeline("question-answering", model = ".\ClassInfoTAPipeline")
context_file = open('dummyTest.txt','r')

def AnswerQuestion(question):
    QA_Input = {'question': question,
            'context': context_file.read()}
    
    q = nlp(QA_Input)
    print('Question: ' + question)
    if (q['score'] > 0.3): print('Answer: ' + q['answer'])
    else: print('Answer: I am not too confident on that question, please contact the TA for this class if you need more information')

AnswerQuestion(' '.join(sys.argv[1:]))