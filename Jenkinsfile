pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_USER = credentials('docker-hub-creds') // Docker Hub credentials ID
        DOCKER_PASS = credentials('docker-hub-creds') // Docker Hub credentials ID
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
                echo "📦 Installing npm dependencies inside Docker..."
                // Run Node.js in Docker using host Docker
                sh '''
                    docker run --rm \
                    -v $PWD:/app \
                    -w /app \
                    node:18 \
                    sh -c "npm install"
                '''
            }
        }

        stage('Build') {
            steps {
                echo "🛠️ Building Next.js app inside Docker..."
                sh '''
                    docker run --rm \
                    -v $PWD:/app \
                    -w /app \
                    node:18 \
                    sh -c "npm run build"
                '''
            }
        }

        stage('Check Docker') {
            steps {
                echo "🐳 Checking Docker version on host..."
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
                echo "⬆️ Pushing Docker image to Docker Hub..."
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
