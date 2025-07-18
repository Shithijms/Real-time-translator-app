pipeline {
    agent {
        docker {
            image 'python:3.11'
            args '-u root:root'
        }
    }

    environment {
        VENV_DIR = "venv"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh '''
                    python -m venv $VENV_DIR
                    source $VENV_DIR/bin/activate
                    pip install --upgrade pip
                    pip install -r backend/requirements.txt
                '''
            }
        }

        stage('Run Django Checks') {
            steps {
                sh '''
                    source $VENV_DIR/bin/activate
                    cd backend
                    python manage.py check
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    source $VENV_DIR/bin/activate
                    cd backend
                    python manage.py test
                '''
            }
        }
    }
}
