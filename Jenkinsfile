pipeline {
    agent any

    environment {
        NODE_OPTIONS = '--openssl-legacy-provider'
        NEXT_DISABLE_SQUOOSH = '1'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "🛠️ Building the app..."
                sh '''
                    rm -rf node_modules package-lock.json
                    npm install
                    npm run build
                '''
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Skipping tests for now..."
            }
        }

        stage('Package') {
            steps {
                echo "📦 Skipping Docker build for now..."
            }
        }

        stage('Deploy') {
            steps {
                echo "🚀 Skipping deploy for now..."
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
    }
}
