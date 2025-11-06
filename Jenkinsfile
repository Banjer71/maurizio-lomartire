pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_USER = credentials('docker-hub-creds') // the ID from above
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

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm dependencies..."
                sh 'npm install'
            }
        }

        stage('Save node_modules') {
            steps {
                echo "💾 Saving node_modules for cache..."
                // Nothing special needed if using workspace persistence
                echo "node_modules will persist in workspace for next build"
            }
        }

        stage('Build') {
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
                // Example: docker login + docker push
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
