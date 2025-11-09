pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_USER = credentials('docker-hub-creds') // Docker Hub credentials ID
        DOCKER_PASS = credentials('docker-hub-creds') // Same ID
        NGROK_AUTH_TOKEN = credentials('ngrok-auth-token') // store ngrok token in Jenkins
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
                echo "📂 Restoring cached node_modules..."
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
                echo "📦 Installing npm dependencies in Node container..."
                sh 'docker run --rm -v $PWD:/app -w /app node:18 npm install'
            }
        }

        stage('Build') {
            steps {
                echo "🛠️ Building Next.js app..."
                sh 'docker run --rm -v $PWD:/app -w /app node:18 npm run build'
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

        stage('Cleanup Old Containers') {
            steps {
                echo "🧹 Cleaning up any old running containers..."
                sh '''
                docker rm -f nextjs-app ngrok || true
                '''
            }
        }

        stage('Run App Container') {
            steps {
                echo "🚀 Running app container..."
                sh 'docker run -d --name nextjs-app -p 3000:3000 maurizio-lomartire:latest'
            }
        }

        stage('Start ngrok') {
            steps {
                echo "🌐 Exposing app via ngrok..."
                // Linux host-friendly ngrok
                sh '''
                docker run -d --name ngrok \
                --network host \
                -e NGROK_AUTHTOKEN=$NGROK_AUTH_TOKEN \
                wernight/ngrok ngrok http 3000
                '''
                sh 'echo "Visit http://localhost:4040 to see ngrok public URL"'
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
