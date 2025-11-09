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
                sh 'cat Dockerfile'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "📦 Building Docker image (includes npm install & build)..."
                sh 'docker build -t maurizio-lomartire:latest .'
            }
        }

        stage('Test Image') {
            steps {
                echo "🧪 Verifying image was built..."
                sh 'docker images | grep maurizio-lomartire'
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
                docker rm -f nextjs-app 2>/dev/null || true
                docker rm -f ngrok 2>/dev/null || true
                '''
            }
        }

        stage('Run App Container') {
            steps {
                echo "🚀 Running app container..."
                sh 'docker run -d --name nextjs-app -p 3000:3000 maurizio-lomartire:latest'
                sh 'sleep 5'
                sh 'docker ps | grep nextjs-app'
                sh 'docker logs nextjs-app'
                echo "✅ App running on port 3000"
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
                sh 'sleep 5'
                sh 'docker logs ngrok'
                echo "🌐 Visit http://localhost:4040 to see ngrok public URL"
            }
        }

        stage('Get ngrok URL') {
            steps {
                echo "🌐 Fetching ngrok public URL..."
                sh '''
                echo "Waiting for ngrok to start..."
                sleep 3
                curl -s http://localhost:4040/api/tunnels | grep -o "https://[a-z0-9-]*.ngrok-free.app" | head -1 || echo "URL not ready yet, check http://localhost:4040"
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline finished successfully!"
            echo "🌐 Check ngrok dashboard: http://localhost:4040"
            echo "📱 Your app is now public via ngrok!"
        }
        failure {
            echo "❌ Pipeline failed."
            sh 'docker logs nextjs-app 2>/dev/null || echo "No app logs"'
            sh 'docker logs ngrok 2>/dev/null || echo "No ngrok logs"'
        }
    }
}