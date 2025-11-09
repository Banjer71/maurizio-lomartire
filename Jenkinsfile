pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-creds') // This creates DOCKER_HUB_CREDENTIALS_USR and DOCKER_HUB_CREDENTIALS_PSW
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

        stage('Debug Credentials') {
            steps {
                echo "Testing credentials..."
                sh 'echo "Username: $DOCKER_HUB_CREDENTIALS_USR"'
                sh 'echo "Password length: $(echo $DOCKER_HUB_CREDENTIALS_PSW | wc -c)"'
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "⬆️ Pushing Docker image to Docker Hub..."
                sh '''
                    echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin
                    docker tag maurizio-lomartire:latest $DOCKER_HUB_CREDENTIALS_USR/maurizio-lomartire:latest
                    docker push $DOCKER_HUB_CREDENTIALS_USR/maurizio-lomartire:latest
                '''
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
        # Stop any existing ngrok
        docker rm -f ngrok 2>/dev/null || true
        
        # Start fresh ngrok
        docker run -d --name ngrok \
        --link nextjs-app:http \
        -e NGROK_AUTHTOKEN=$NGROK_AUTH_TOKEN \
        wernight/ngrok ngrok http nextjs-app:3000
        '''
        sh 'sleep 8'
    }
}

stage('Get ngrok URL') {
    steps {
        echo "🌐 Your public URL:"
        sh '''
        docker exec ngrok curl -s http://localhost:4040/api/tunnels | \
        grep -o '"public_url":"https://[^"]*"' | \
        head -1 | \
        cut -d'"' -f4 || \
        echo "Run: docker exec ngrok curl http://localhost:4040/api/tunnels"
        '''
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