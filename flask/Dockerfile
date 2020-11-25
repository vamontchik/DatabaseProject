FROM python:3

# Copy package requirements and server code into Docker container
COPY . /app

WORKDIR /app

#install all packages in requirements.txt
RUN pip3 install -r requirements.txt

# unbuffered output so we see all stdouts !
CMD [ "python3", "-u", "flask_server.py" ]
