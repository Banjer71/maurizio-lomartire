pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        DOCKER_USER = credentials('docker-hub-creds')      // Docker Hub credentials ID
        DOCKER_PASS = credentials('docker-hub-creds')      // Same ID
        NGROK_AUTH_TOKEN = credentials('ngrok-auth-token') // store ngrok token in Jenkins
    }

    stages {
        
        // --- STAGES 1 & 2 (Clean/Checkout) REMOVED ---
        // Jenkins performs SCM Checkout automatically before the first stage.

        // ===============================
        // 1️⃣ Restore node_modules (was 3️⃣)
        // ===============================
        stage('Restore node_modules') {
            steps {
                echo "📂 Restoring cached node_modules..."
                script {
                    // This fileExists will now check the files provided by the
                    // automatic Declarative SCM checkout.
                    if (fileExists('node_modules')) {
                        echo "✅ node_modules cache found"
                    } else {
                        echo "⚠️ No cache, will install dependencies"
                    }
                }
            }
        }

        // ===============================
        // 2️⃣ Install dependencies (was 4️⃣)
        // ===============================
        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm dependencies in Node container..."
                sh 'docker run --rm -v $PWD:/app -w /app node:18 npm install'
            }
        }

        // ===============================
        // 3️⃣ Build Next.js app (was 5️⃣)
        // ===============================
        stage('Build') {
            steps {
                echo "🛠️ Building Next.js app..."
                sh 'docker run --rm -v $PWD:/app -w /app node:18 npm run build'
            }
        }

        // ===============================
        // 4️⃣ Check Docker (was 6️⃣)
        // ===============================
        stage('Check Docker') {
            steps {
                echo "🐳 Checking Docker version on host..."
                sh 'docker version'
            }
        }

        // ===============================
        // 5️⃣ Build Docker image (was 7️⃣)
        // ===============================
        stage('Build Docker Image') {
            steps {
                echo "📦 Building Docker image..."
                sh 'docker build -t maurizio-lomartire:latest .'
            }
        }

        // ===============================
        // 6️⃣ Push Docker image to Docker Hub (was 8️⃣)
        // ===============================
        stage('Push Docker Image') {
            steps {
                echo "⬆️ Pushing Docker image to Docker Hub..."
                // NOTE: Use withCredentials for a more secure and cleaner login
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USR', passwordVariable: 'DOCKER_PSW')]) {
                    sh "docker login -u ${env.DOCKER_USR} -p ${env.DOCKER_PSW}"
                }
                sh 'docker tag maurizio-lomartire:latest $DOCKER_USER/maurizio-lomartire:latest'
                sh 'docker push $DOCKER_USER/maurizio-lomartire:latest'
            }
        }

        // ===============================
        // 7️⃣ Cleanup old containers (was 9️⃣)
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
        // 8️⃣ Run App Container (was 10️⃣)
        // ===============================
        stage('Run App Container') {
            steps {
                echo "🚀 Running app container..."
                sh 'docker run -d --name nextjs-app -p 3000:3000 maurizio-lomartire:latest'
            }
        }

        // ===============================
        // 9️⃣ Start ngrok (was 11️⃣)
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
        post {
        success {
            echo "✅ Pipeline finished successfully!"
        }
        failure {
            echo "❌ Pipeline failed."
        }
        // ADDED: Always run cleanup after the pipeline attempts to run
        always {
            // Cleanup old containers and then delete the workspace
            stage('Cleanup All') {
                steps {
                    echo "🧹 Running final cleanup steps..."
                    // 1. Clean up old Docker containers (if they were started)
                    sh '''
                    if [ $(docker ps -aq -f name=nextjs-app) ]; then
                        docker rm -f nextjs-app
                    fi
                    if [ $(docker ps -aq -f name=ngrok) ]; then
                        docker rm -f ngrok
                    fi
                    '''
                    // 2. Delete the workspace files to ensure a fresh run next time
                    echo "🧹 Deleting workspace files..."
                    deleteDir() // This works correctly inside a stage/steps block
                }
            }
        }
    }

    }
}