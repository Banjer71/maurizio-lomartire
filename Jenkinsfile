pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_USER = credentials('docker-hub-creds') // the ID from Jenkins credentials
        DOCKER_PASS = credentials('docker-hub-creds') // same ID
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔄 Checking out code..."
                checkout scm
            }
        }

        stage('Restore node_modules') {
            steps {
                echo "📂 Restoring cached node_modules (if exists)..."
                script {
                    if (fileExists('node_modules')) {
                        echo "✅ node_modules cache found"
                    } else {
                        echo "⚠️ No cache, will install dependencies"
                    }
                }
            }
        }

        // Use a Node.js Docker image for these stages
        stage('Install Dependencies') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                echo "📦 Installing npm dependencies..."
                sh 'npm install'
            }
        }

        stage('Build') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                echo "🛠️ Building Next.js app..."
                sh 'npm run build'
            }
        }

        stage('Check Docker') {
            steps {
                echo "🐳 Checking Docker version..."
                sh 'docker version'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "📦 Building Docker image..."
                sh 'docker build -t maurizio-lomartire:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "⬆️ Pushing Docker image (if needed)..."
                sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                sh 'docker tag maurizio-lomartire:latest $DOCKER_USER/maurizio-lomartire:latest'
                sh 'docker push $DOCKER_USER/maurizio-lomartire:latest'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline finished successfully!"
        }
        failure {
            echo "❌ Pipeline failed."
        }
    }
}
