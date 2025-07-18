pipeline {
    agent any

    environment {
        VENV_DIR = "venv"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Shithijms/Real-time-translator-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                    python -m venv $VENV_DIR
                    source $VENV_DIR/bin/activate
                    pip install -r backend/requirements.txt
                '''
            }
        }

        stage('Run Django Checks') {
            steps {
                bat '''
                    source $VENV_DIR/bin/activate
                    cd backend
                    python manage.py check
                '''
            }
        }

        stage('Run Tests') {
            steps {
                bat '''
                    source $VENV_DIR/bin/activate
                    cd backend
                    python manage.py test
                '''
            }
        }
    }
}
