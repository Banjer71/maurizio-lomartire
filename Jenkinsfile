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
                echo '🌐 Starting ngrok tunnel...'
                sh '''
                    pkill ngrok || true
                    docker rm -f ngrok || true
                    docker run -d --name ngrok \
                        --net=container:nextjs-app \
                        -e NGROK_AUTHTOKEN=$NGROK_AUTH_TOKEN \
                        ngrok/ngrok:latest http 3000
                '''
                sleep 10
            }
}

        stage('Get ngrok URL') {
    steps {
        echo '🌐 Fetching public ngrok URL...'
        script {
            // First check if container is running
            def containerRunning = sh(
                script: "docker inspect -f '{{.State.Running}}' ngrok",
                returnStdout: true
            ).trim()
            
            echo "📊 ngrok container running: ${containerRunning}"
            
            if (containerRunning == 'true') {
                // Get the URL from ngrok's own API endpoint
                def ngrokUrl = sh(
                    script: """
                        sleep 5
                        docker exec ngrok wget -qO- http://127.0.0.1:4040/api/tunnels | \
                        grep -o '"public_url":"https://[^"]*"' | \
                        head -1 | \
                        cut -d'"' -f4
                    """,
                    returnStdout: true
                ).trim()
                
                if (ngrokUrl) {
                    echo "🔗 Your app is available at: ${ngrokUrl}"
                    echo "🔗 Share this URL with your colleagues: ${ngrokUrl}"
                } else {
                    echo "⚠️ Could not retrieve ngrok URL"
                    sh "docker logs ngrok"
                }
            } else {
                echo "❌ ngrok container is not running!"
                sh "docker logs ngrok"
            }
        }
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
