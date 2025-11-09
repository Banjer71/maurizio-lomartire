pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_USER = credentials('docker-hub-creds')      // Docker Hub credentials ID
        DOCKER_PASS = credentials('docker-hub-creds')      // Same ID
        NGROK_AUTH_TOKEN = credentials('ngrok-auth-token') // store ngrok token in Jenkins
    }

    stages {

        // ===============================
        // 1️⃣ Clean Workspace
        // ===============================
        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning workspace..."
                deleteDir() // removes all files, ensures fresh checkout
            }
        }

        // ===============================
        // 2️⃣ Checkout repository
        // ===============================
        stage('Checkout') {
            steps {
                echo "🔄 Checking out repository..."
                checkout scm
            }
        }

        // ===============================
        // 3️⃣ Restore node_modules (if cached)
        // ===============================
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

        // ===============================
        // 4️⃣ Install dependencies
        // ===============================
        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm dependencies in Node container..."
                sh 'docker run --rm -v $PWD:/app -w /app node:18 npm install'
            }
        }

        // ===============================
        // 5️⃣ Build Next.js app
        // ===============================
        stage('Build') {
            steps {
                echo "🛠️ Building Next.js app..."
                sh 'docker run --rm -v $PWD:/app -w /app node:18 npm run build'
            }
        }

        // ===============================
        // 6️⃣ Check Docker
        // ===============================
        stage('Check Docker') {
            steps {
                echo "🐳 Checking Docker version on host..."
                sh 'docker version'
            }
        }

        // ===============================
        // 7️⃣ Build Docker image
        // ===============================
        stage('Build Docker Image') {
            steps {
                echo "📦 Building Docker image..."
                sh 'docker build -t maurizio-lomartire:latest .'
            }
        }

        // ===============================
        // 8️⃣ Push Docker image to Docker Hub
        // ===============================
        stage('Push Docker Image') {
            steps {
                echo "⬆️ Pushing Docker image to Docker Hub..."
                sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                sh 'docker tag maurizio-lomartire:latest $DOCKER_USER/maurizio-lomartire:latest'
                sh 'docker push $DOCKER_USER/maurizio-lomartire:latest'
            }
        }

        // ===============================
        // 9️⃣ Cleanup old containers
        // ===============================
        stage('Cleanup Old Containers') {
            steps {
                echo "🧹 Cleaning up old containers..."
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

        // ===============================
        // 🔟 Run Next.js app container
        // ===============================
        stage('Run App Container') {
            steps {
                echo "🚀 Running app container..."
                sh 'docker run -d --name nextjs-app -p 3000:3000 maurizio-lomartire:latest'
            }
        }

        // ===============================
        // 1️⃣1️⃣ Start ngrok to expose app
        // ===============================
        stage('Start ngrok') {
            steps {
                echo "🌐 Exposing app via ngrok..."
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
