# Chatbot Frontend
A virtual chatbot that replecates a similar Teacher-Assistant enviornment in real-life

## Screenshot
![enter image description here](./backend/frontend/static/img/demo.png)


## Instructions to run locally

Download clone files on right under releases tab and put files into folder called ClassInfoTAPipeline and put folder in backend folder

Go to backend directory in terminal

Install python 3
https://www.python.org/downloads/

Install flask:
pip install flask

Install flask-cors:
pip install -U flask-cors

Install PyTorch:
https://pytorch.org/get-started/locally/
Go to this website and select the correct options based on your machine. Copy the command given and run
Sample command: pip3 install torch torchvision torchaudio

Install transformers:
pip install transformers

Install rasa:
pip install rasa

Afterwards download both releases, the Rasa model and the Classroom TA Pipeline. Put the rasa model in the same directory as the GitHub repository, and put the Classroom TA Pipeline in the virtual-teacher-assistance folder. Afterwards open two terminals and run

flask --app ClassTAScript.py run

While in the backend folder and

rasa run --enable-api --cors="*" --port 5005

While in the RasaTest folder.

Afterwards run a run & debug on the bot.html file within front-end and the chatbot should pop up.
