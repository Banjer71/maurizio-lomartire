pipeline {
    agent any

    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Git branch to build & deploy')
    }

    environment {
        NODE_ENV = 'production'
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-creds')
        NGROK_AUTH_TOKEN = credentials('ngrok-auth-token')
        IMAGE_NAME = "maurizio-lomartire"
        FULL_IMAGE = "${DOCKER_HUB_CREDENTIALS_USR}/maurizio-lomartire:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📥 Checking out branch: ${params.BRANCH}"
                checkout([$class: 'GitSCM',
                    branches: [[name: "*/${params.BRANCH}"]],
                    userRemoteConfigs: [[url: 'git@github.com:Banjer71/maurizio-lomartire.git']]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "📦 Building Docker image..."
                sh """
                    docker build --pull --no-cache=false -t $IMAGE_NAME .
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "⬆️ Pushing Docker image to Docker Hub..."
                sh '''
                    echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin
                    docker tag $IMAGE_NAME $FULL_IMAGE
                    docker push $FULL_IMAGE
                '''
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                sh '''
                    docker rm -f nextjs-app 2>/dev/null || true
                    docker rm -f ngrok 2>/dev/null || true
                '''
            }
        }

        stage('Run App Container') {
            steps {
                echo "🚀 Starting latest app container..."
                sh """
                    docker run -d --name nextjs-app -p 3000:3000 $IMAGE_NAME
                """
                sleep 5
            }
        }

        stage('Start ngrok') {
            steps {
                echo "🌐 Starting ngrok tunnel..."
                sh """
                    docker rm -f ngrok 2>/dev/null || true

                    docker run -d --name ngrok \
                        --link nextjs-app:http \
                        -e NGROK_AUTHTOKEN=$NGROK_AUTH_TOKEN \
                        wernight/ngrok ngrok http nextjs-app:3000
                """
                sleep 8
            }
        }

        stage('Get ngrok URL') {
            steps {
                echo "🌐 Fetching public ngrok URL..."
                sh '''
                    docker exec ngrok curl -s http://localhost:4040/api/tunnels | \
                    grep -o '"public_url":"https://[^"]*"' | \
                    head -1 | cut -d'"' -f4
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline finished successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
            sh "docker logs nextjs-app 2>/dev/null || true"
            sh "docker logs ngrok 2>/dev/null || true"
        }
    }
}
