pipeline {
    agent any

    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Git branch to build & deploy')
    }

    environment {
        NODE_ENV = 'production'
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-creds')
        IMAGE_NAME = "maurizio-lomartire"
        FULL_IMAGE = "${DOCKER_HUB_CREDENTIALS_USR}/maurizio-lomartire:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📥 Checking out branch: ${params.BRANCH}"
                checkout([$class: 'GitSCM',
                    branches: [[name: "*/${params.BRANCH}"]],
                    userRemoteConfigs: [[url: 'https://github.com/Banjer71/maurizio-lomartire.git']]
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

        stage('Deployment Info') {
            steps {
                echo '✅ Application deployed successfully!'
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo '🔗 Local access: http://localhost:3000'
                echo '🌐 Public access: Use your existing ngrok tunnel'
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo '💡 Your webhook ngrok tunnel will automatically point to the updated app'
                echo '📝 No action needed - just keep your terminal ngrok running'
            }
}
    }

    post {
        success {
            echo "✅ Pipeline finished successfully!"
            echo "🎯 App is running on port 3000"
        }
        failure {
            echo "❌ Pipeline failed!"
            sh "docker logs nextjs-app 2>/dev/null || true"
        }
    }
}