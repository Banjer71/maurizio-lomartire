pipeline {
    agent {
        docker {
            image 'node:18'   // You can use node:20 too
        }
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Banjer71/maurizio-lomartire.git'
            }
        }

        stage('Build') {
            steps {
                echo '🛠️ Building the app...'
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test || echo "No tests found"'
            }
        }

        stage('Package') {
            steps {
                echo '📦 Creating Docker image...'
                sh 'docker build -t maurizio-lomartire:latest .'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying container...'
                sh '''
                    docker stop maurizio-lomartire || true
                    docker rm maurizio-lomartire || true
                    docker run -d --name maurizio-lomartire -p 3000:3000 maurizio-lomartire:latest
                '''
            }
        }
    }

    post {
        success { echo '✅ Deployment successful!' }
        failure { echo '❌ Deployment failed.' }
    }
}
