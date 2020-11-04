FROM python:3

# Copy package requirements and server code into Docker container
COPY . /app

WORKDIR /app

#install all packages in requirements.txt
RUN pip3 install -r requirements.txt

CMD [ "python3", "flask_server.py" ]
