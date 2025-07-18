pipeline {
    agent any

    environment {
        DJANGO_SETTINGS_MODULE = "backend.settings"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'pip install -r backend/requirements.txt'
            }
        }

        stage('Run Django Checks') {
            steps {
                sh 'python backend/manage.py check'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'python backend/manage.py test'
            }
        }
    }
}
