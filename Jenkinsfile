pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_USER = credentials('docker-hub-creds')
        DOCKER_PASS = credentials('docker-hub-creds')
        NGROK_AUTH_TOKEN = credentials('ngrok-auth-token')
    }

    stages {
        stage('Checkout') {
            steps {
                echo "📥 Code already checked out by Jenkins"
                sh 'ls -la'
                sh 'pwd'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm dependencies in Node container..."
                sh '''
                    docker run --rm \
                    -v "$(pwd)":/app \
                    -w /app \
                    node:18-alpine \
                    npm install
                '''
            }
        }

        stage('Build') {
            steps {
                echo "🛠️ Building Next.js app..."
                sh '''
                    docker run --rm \
                    -v "$(pwd)":/app \
                    -w /app \
                    node:18-alpine \
                    npm run build
                '''
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
                sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                sh 'docker tag maurizio-lomartire:latest $DOCKER_USER/maurizio-lomartire:latest'
                sh 'docker push $DOCKER_USER/maurizio-lomartire:latest'
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                echo "🧹 Cleaning up any old running containers..."
                sh '''
                if [ $(docker ps -aq -f name=nextjs-app) ]; then
                    docker rm -f nextjs-app
                fi
                if [ $(docker ps -aq -f name=ngrok) ]; then
                    docker rm -f ngrok
                fi
                '''
            }
        }

        stage('Run App Container') {
            steps {
                echo "🚀 Running app container..."
                sh 'docker run -d --name nextjs-app -p 3000:3000 maurizio-lomartire:latest'
                sh 'sleep 5'
                sh 'docker ps | grep nextjs-app || echo "Container not running!"'
                echo "✅ App should be running on port 3000"
            }
        }

        stage('Start ngrok') {
            steps {
                echo "🌐 Exposing app via ngrok..."
                sh '''
                docker run -d --name ngrok \
                --network host \
                -e NGROK_AUTHTOKEN=$NGROK_AUTH_TOKEN \
                wernight/ngrok ngrok http 3000
                '''
                sh 'sleep 3'
                echo "🌐 Visit http://localhost:4040 to see ngrok public URL"
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline finished successfully!"
            echo "🌐 Check ngrok dashboard: http://localhost:4040"
        }
        failure {
            echo "❌ Pipeline failed."
        }
    }
}