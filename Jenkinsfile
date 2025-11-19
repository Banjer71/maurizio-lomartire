pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-creds') // Creates _USR and _PSW vars
        NGROK_AUTH_TOKEN = credentials('ngrok-auth-token')
        IMAGE_NAME = "maurizio-lomartire"
        FULL_IMAGE = "${DOCKER_HUB_CREDENTIALS_USR}/maurizio-lomartire:latest"
    }

    stages {
        
        stage('Checkout') {
            steps {
                echo "⬆️ Pushing image to Docker Hub..."
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "📦 Building Docker image (Docker caching applied)..."
                sh """
                    docker build --pull --no-cache=false -t $IMAGE_NAME .
                """
                }
            }
        }

        // stage('Test Image') {
        //     steps {
        //         echo "🧪 Verifying image was built..."
        //         sh 'docker images | grep maurizio-lomartire || echo "❌ Image not found!"'
        //     }
        // }

        // stage('Debug Credentials') {
        //     steps {
        //         echo "🔍 Testing Docker credentials..."
        //         sh 'echo "Username: $DOCKER_HUB_CREDENTIALS_USR"'
        //         sh 'echo "Password length: $(echo $DOCKER_HUB_CREDENTIALS_PSW | wc -c)"'
        //     }
        // }

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
                echo "🌐 Exposing app via ngrok..."
                steps {
                echo "🌍 Starting ngrok tunnel..."
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
                echo "🌐 Fetching public URL from ngrok..."
                sh '''
                    docker exec ngrok curl -s http://localhost:4040/api/tunnels | \
                    grep -o '"public_url":"https://[^"]*"' | \
                    head -1 | \
                    cut -d'"' -f4
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
            echo "📄 App logs:"
            sh "docker logs nextjs-app 2>/dev/null || true"
            echo "📄 ngrok logs:"
            sh "docker logs ngrok 2>/dev/null || true"
        }
    }
}
